#!/bin/bash
# ローカルサーバー起動 & Windows ポートフォワード設定スクリプト

WSL_IP=$(hostname -I | awk '{print $1}')
PORT=8080
DIR="$(cd "$(dirname "$0")/mockups" && pwd)"

echo "=========================================="
echo " BlueLamp HP モックアップ サーバー起動"
echo "=========================================="
echo ""
echo "WSL2 IP : $WSL_IP"
echo "ポート  : $PORT"
echo "ディレクトリ: $DIR"
echo ""
echo "【他PCからアクセスするには】"
echo "Windowsの管理者PowerShellで以下を実行:"
echo ""
echo "  netsh interface portproxy add v4tov4 listenport=$PORT listenaddress=0.0.0.0 connectport=$PORT connectaddress=$WSL_IP"
echo "  netsh advfirewall firewall add rule name=\"WSL2 Mockup $PORT\" dir=in action=allow protocol=TCP localport=$PORT"
echo ""
echo "その後、同じネットワーク内の他PCから:"
echo "  http://<このPCのWindowsIP>:$PORT"
echo ""
echo "------------------------------------------"
echo "Ctrl+C で停止"
echo "------------------------------------------"
echo ""

cd "$DIR" && python3 -m http.server $PORT --bind 0.0.0.0
