/**
 * Data of supported engines for export
 */

export enum EngineEnum {
  UnrealEngine = 'Unreal Engine'
}

export const Engines = [EngineEnum.UnrealEngine];

export const EngineVersions = new Map<EngineEnum, string[]>(
  [
    [EngineEnum.UnrealEngine, ['4.25', '4.24']]
  ]
);
