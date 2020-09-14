<template>
  <v-row>
    <v-col>
      <div id="preview" ref="preview"></div>
      <v-progress-linear
        v-show="loading"
        color="primary"
        height="5"
        indeterminate
        striped
      />
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { Component, Prop, Ref, Vue, Watch } from 'vue-property-decorator';
import {
  CubeTexture, CubeTextureLoader,
  DirectionalLight, Group, HemisphereLight,
  Mesh, MeshStandardMaterial, Object3D, PCFSoftShadowMap,
  PerspectiveCamera, PMREMGenerator, ReinhardToneMapping,
  Scene, sRGBEncoding, Texture, TextureLoader,
  WebGLRenderer
} from 'three';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { Asset } from '@/shared/asset/interfaces/asset';
import { debounce } from '@/utils/debounce';

@Component
export default class AssetPreviewScene extends Vue {

  /**
   * Refs
   */
  @Ref('preview') readonly preview!: HTMLElement;

  /**
   * Vuex
   */

  /**
   * Props
   */
  @Prop() readonly asset!: Asset;


  /**
   * Data
   */
  scene!: Scene;
  renderer!: WebGLRenderer;
  camera!: PerspectiveCamera;
  fbxLoader!: FBXLoader;
  textureLoader!: TextureLoader;
  cubeTextureLoader!: CubeTextureLoader;
  controls!: OrbitControls;
  pmRemGenerator!: PMREMGenerator;
  skyLight!: HemisphereLight;
  directionalLight!: DirectionalLight;
  material = new MeshStandardMaterial({ metalness: 1 });
  assetRef!: Mesh<any>;
  debouncedApply = debounce(this.applyChanges, 200);
  loading: boolean = false;

  /**
   * Hooks
   */

  async mounted() {
    this.initializeLoaders();
    await this.initializeScene();
    this.initializeLighting();
    this.initializeRenderer();
    this.initializeCamera();
    this.initializeControls();

    this.renderScene();
  }

  /**
   * Watchers
   */

  @Watch('asset.model')
  async onModelChange() {
    if (!this.asset.model) return;

    await this.loadMesh()
    await this.debouncedApply();
  }

  @Watch('asset.albedo')
  async onAlbedoChange() {
    if (!this.asset.albedo) return;

    await this.loadAlbedo();
    await this.debouncedApply();
  }

  @Watch('asset.metalness')
  async onMetalnessChange() {
    if (!this.asset.metalness) return;

    await this.loadMetalness();
    await this.debouncedApply();
  }

  @Watch('asset.roughness')
  async onRoughnessChange() {
    if (!this.asset.roughness) return;

    await this.loadRoughness();
    await this.debouncedApply();
  }

  @Watch('asset.normal')
  async onNormalChange() {
    if (!this.asset.normal) return;

    await this.loadNormal();
    await this.debouncedApply();
  }

  /**
   * Emitters
   */

  /**
   * Methods
   */

  initializeLoaders() {
    this.fbxLoader = new FBXLoader();
    this.textureLoader = new TextureLoader();
    this.cubeTextureLoader = new CubeTextureLoader();
  }

  async initializeScene() {
    this.scene = new Scene();

    this.material.envMap = this.scene.background = await this.loadCubeMap();
  }

  initializeLighting() {
    // Sky lighting
    this.skyLight = new HemisphereLight('#ffffff', '#444444');
    this.skyLight.position.set(0, 200, 0);
    this.scene.add(this.skyLight);

    // Directional light
    const d = this.directionalLight = new DirectionalLight('#ffffff');
    d.intensity = 1;
    d.position.set(0, 200, 100);
    d.castShadow = true;
    d.shadow.camera.top = 180;
    d.shadow.camera.bottom = - 100;
    d.shadow.camera.left = - 120;
    d.shadow.camera.right = 120;
    this.scene.add(this.directionalLight);
  }

  initializeCamera() {
    this.camera = new PerspectiveCamera(50, this.preview.clientWidth / this.preview.clientHeight, 0.1, 1000);
  }

  initializeRenderer() {
    this.renderer = new WebGLRenderer({
      antialias: true,
      preserveDrawingBuffer: true
    });
    this.renderer.setPixelRatio(3);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = PCFSoftShadowMap;
    this.renderer.outputEncoding = sRGBEncoding;
    this.renderer.toneMapping = ReinhardToneMapping;
    this.renderer.toneMappingExposure = 2;
    this.preview.appendChild(this.renderer.domElement);
  }

  initializeControls() {
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.target.set(0, 0, 0);
    this.controls.addEventListener('change', () => this.renderScene());
    this.controls.update();
  }

  renderScene() {
    this.renderer.render(this.scene, this.camera);
  }

  async loadMesh() {
    this.loading = true;
    return new Promise((resolve, reject) => {
      this.fbxLoader.load(`safe-file-protocol://${this.asset.model?.path}`,
        (object: Group) => {
          object.traverse((object: Object3D) => {
            if (object instanceof Mesh) {
              object.castShadow = true;
              object.receiveShadow = true;
              object.material = this.material;

              this.camera.position.z = object.scale.z * 2;
              this.camera.position.x = -(object.scale.x * 2);
              this.camera.lookAt(object.position);

              this.assetRef = object;
            }
          });
          this.scene.add(object);
          resolve();
        },
        undefined,
        (error: ErrorEvent) => reject(error)
      );
    });
  }

  async loadAlbedo() {
    this.loading = true;
    this.material.map = await this.convertPathToTexture(this.asset.albedo!.path);
    this.material.map.encoding = sRGBEncoding;
  }

  async loadMetalness() {
    this.loading = true;
    this.material.metalnessMap = await this.convertPathToTexture(this.asset.metalness!.path);
  }

  async loadRoughness() {
    this.loading = true;
    this.material.roughnessMap = await this.convertPathToTexture(this.asset.roughness!.path);
  }

  async loadNormal() {
    this.loading = true;
    this.material.normalMap = await this.convertPathToTexture(this.asset.normal!.path);
  }

  loadCubeMap(): Promise<CubeTexture> {
    return new Promise((resolve, reject) => {
      this.cubeTextureLoader.load(
        ['px', 'nx', 'py', 'ny', 'pz', 'nz']
          .map((name) => require(`@/assets/cubemap/${name}.png`)),
        (texture: CubeTexture) => resolve(texture),
        progress => console.log('progress', progress),
        error => {
          reject(error);
        }
      )
    });
  }

  convertPathToTexture(path: string): Promise<Texture> {
    return new Promise((resolve, reject) => {
      this.textureLoader.load(
        `safe-file-protocol://${path}`,
        texture => { console.log(path, 'loaded'); resolve(texture); },
        undefined,
        error => reject(error)
      );
    });
  }

  getCurrentRenderImage(): string {
    return this.renderer.domElement.toDataURL();
  }

  async applyChanges() {

    this.assetRef.material = this.material;
    this.assetRef.material.needsUpdate = true;

    this.renderScene();

    this.loading = false;
  }

  resetScene() {
    if (this.assetRef && this.assetRef.parent) {
      this.scene.remove(this.assetRef.parent);
      this.renderScene();
    }
  }
}
</script>

<style>
#preview, #preview canvas {
  width: 100%;
  height: 275px;
  max-width: 100%;
  max-height: 100%;
}

#preview canvas:focus {
  outline: none;
}
</style>
