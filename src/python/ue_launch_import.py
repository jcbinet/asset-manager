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
# Import Unreal Engine remote execution script
import remote_execution as remote


# Execute a command remotely using unreal remote execution script
def execute_remote_command(command):
  remote_exec = remote.RemoteExecution()
  remote_exec.start()
  remote_exec.open_command_connection(remote_exec.remote_nodes)
  exec_mode = 'EvaluateStatement'
  rec = remote_exec.run_command(command, exec_mode=exec_mode)
  if rec['success']:
    return rec['result']
  return None


# Run import asset from plugin
def import_asset():
  command = "str(asset_manager.import_asset())"
  return execute_remote_command(command)


# Get result of import
import_asset_result = import_asset()

# Return proper exit code depending on import result
if import_asset_result is None:
  # Error
  sys.exit(1)
else:
  # Success
  sys.exit(0)
