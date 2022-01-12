import subprocess
import json

manifest = json.load(open('./src/manifest.json'))
subprocess.call(
    ['7z', 'a', f'../hide-discord-sidebar-{manifest["version"]}.zip', '*'], cwd="./src")
