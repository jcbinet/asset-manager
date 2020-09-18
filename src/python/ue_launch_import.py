import sys
import json
from os import path

# Get path to asset manager state
asset_manager_state_path = path.expandvars(r'%APPDATA%\asset-manager\state.json')

# Load asset_manager_state json
asset_manager_state = json.load(open(asset_manager_state_path))

# Append path to use python plugins inside unreal engine
unreal_engine_plugin_path = asset_manager_state['setting']['ueSettings']['uePath']
sys.path.append(
  asset_manager_state['setting']['ueSettings']['uePath'] + '\Experimental\PythonScriptPlugin\Content\Python'
)
import remote_execution as remote


def execute_remote_command(command):
  remote_exec = remote.RemoteExecution()
  remote_exec.start()
  remote_exec.open_command_connection(remote_exec.remote_nodes)
  exec_mode = 'EvaluateStatement'
  rec = remote_exec.run_command(command, exec_mode = exec_mode)
  if rec['success']:
    return rec['result']
  return None


# Based on the selected assets in the ue4 asset browser, return an array with asset paths
# ['StaticMesh"/Game/art/Meshes/ST_gourd01.ST_gourd01"', 'StaticMesh"/Game/art/Meshes/ST_gourd02.ST_gourd02"']
def get_selected_asset_paths():
  asset_paths = []
  command = "str(import_assets.import_assets())"
  result = execute_remote_command(command)
  if result is not None:
    string = result[2:-2]
    for e in string.split():
      asset_path = e.replace("\\'", "").replace(",", "")
      asset_paths.append(asset_path)
  return asset_paths


print(get_selected_asset_paths())

# Send following message to mark export as complete
print('EXPORT COMPLETE')
sys.stdout.flush()
