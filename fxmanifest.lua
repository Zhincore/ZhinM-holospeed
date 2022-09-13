fx_version "cerulean"
game "gta5"

author "Zhincore <adam@zhincore.eu>"
description "Holographic speedometer"
version "1.0.0"

client_script "dist/client.js"

files {"dui/index.html", "dui/assets/*"}

data_file "DLC_ITYP_REQUEST" "stream/zhinm_holospeed_drawable.ytyp"

fxdk_watch_command 'yarn' {'watch'}
fxdk_build_command 'yarn' {'build'}
