Faz o merge de dev para main e sobe para produção (Vercel).

Execute em ordem:

1. Verifique o último commit da branch dev com `git log dev -1 --pretty=format:"%s"` e pergunte ao usuário: "Posso usar a mensagem do último commit no dev ("<mensagem>")? Ou prefere uma nova mensagem?"
2. `git checkout main`
3. `git merge dev -m "<mensagem informada pelo usuário>"`
4. `git push origin main`
5. `git checkout dev`
6. Informe que o deploy para produção foi concluído

Nunca use --force. Nunca use --no-edit. Nunca crie branch extra.
