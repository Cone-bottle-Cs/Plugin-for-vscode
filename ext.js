const vscode = require('vscode');

function activate(context) {
    console.log('Congratulations, your extension "vsc-plugin-demo" is now active!');

    let disposable = vscode.commands.registerCommand('extension.showHighlighterWidget', function() {
        // 创建一个输入框悬浮窗口
        const panel = vscode.window.createWebviewPanel(
            'highlighterWidget',
            'Highlighter Widget',
            vscode.ViewColumn.Active, {
                // 允许悬浮窗口使用 JavaScript
                enableScripts: true
            }
        );

        // 设置悬浮窗口中的 HTML 内容
        panel.webview.html = getHTMLContent();

        // 监听悬浮窗口中的消息
        panel.webview.onDidReceiveMessage(message => {
            if (message.command === 'highlightStrings') {
                const { stringA, stringB } = message;
                highlightStrings(stringA, stringB);
            }
        });
    });

    context.subscriptions.push(disposable);
}

exports.activate = activate;

function deactivate() {}

function getHTMLContent() {
    // 返回包含输入框和按钮的 HTML 字符串
    return `
        <html>
        <body>
            <h2>Highlighter Widget</h2>
            <div>
                <label for="stringA">Enter String A:</label>
                <input type="text" id="stringA">
            </div>
            <div>
                <label for="stringB">Enter String B:</label>
                <input type="text" id="stringB">
            </div>
            <button onclick="highlightStrings()">Highlight Strings</button>

            <script>
                function highlightStrings() {
                    const stringA = document.getElementById('stringA').value;
                    const stringB = document.getElementById('stringB').value;

                    // 向插件发送消息
                    vscode.postMessage({
                        command: 'highlightStrings',
                        stringA: stringA,
                        stringB: stringB
                    });
                }
            </script>
        </body>
        </html>
    `;
}

function highlightStrings(stringA, stringB) {
    // 实现高亮字符串的逻辑
    console.log(`Highlighting String A: ${stringA}`);
    console.log(`Highlighting String B: ${stringB}`);
    for (value in [stringA, stringB]) {
        if (value) {
            // 获取当前活动编辑器
            let editor = vscode.window.activeTextEditor;
            if (editor) {
                // 获取编辑器的文本内容
                let document = editor.document;
                let text = document.getText();

                // 创建正则表达式，用于匹配用户输入的字符串
                let regex = new RegExp(value, 'g');

                // 用于存储匹配项的范围
                let ranges = [];

                let match;
                // 遍历文本内容，寻找匹配项
                while (match = regex.exec(text)) {
                    let startPos = document.positionAt(match.index);
                    let endPos = document.positionAt(match.index + match[0].length);
                    let range = new vscode.Range(startPos, endPos);
                    ranges.push(range);
                }

                // 对匹配项进行高亮处理
                editor.setDecorations(highlightDecorationType, ranges);
            }
        }
    }
}

module.exports = {
    activate,
    deactivate
};