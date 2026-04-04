Sobe as mudanças apenas para a branch dev (sem tocar na main/produção).

Execute em ordem:

1. `git checkout dev` — garante que estamos na branch certa
2. `git status` — verifica mudanças pendentes
3. Se houver arquivos modificados/novos:
   - Se o usuário passou uma mensagem como argumento, use ela
   - Caso contrário, pergunte a mensagem de commit
   - `git add .`
   - `git commit -m "<mensagem>"`
   - `git push origin dev`
4. Se não houver nada para commitar, informe que não há mudanças e encerre

Nunca toque na branch main. Nunca use --force.
