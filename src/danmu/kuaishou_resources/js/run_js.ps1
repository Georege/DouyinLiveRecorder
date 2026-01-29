# 获取脚本所在的目录
$scriptPath = Split-Path -Parent $MyInvocation.MyCommand.Definition
Set-Location -Path $scriptPath

node ks_env_svc.js
