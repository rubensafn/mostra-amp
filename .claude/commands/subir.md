Faça o deploy do projeto atual seguindo o fluxo padrão de duas branches.

REGRA PERMANENTE: todo projeto usa sempre duas branches — `dev` (desenvolvimento) e `main` (produção/Vercel). Nunca crie uma terceira branch de deploy. Nunca sugira outro fluxo.

Execute em ordem:

1. `git checkout dev` — garante que estamos na branch certa
2. `git status` — verifica mudanças pendentes
3. Se houver arquivos modificados/novos:
   - Se o usuário passou uma mensagem como argumento, use ela
   - Caso contrário, pergunte a mensagem de commit
   - `git add .`
   - `git commit -m "<mensagem>"`
   - `git push origin dev`
4. Se não houver nada para commitar, pule o commit e vá direto ao merge
5. `git checkout main`
6. `git merge dev --no-edit`
7. `git push origin main`
8. `git checkout dev`
9. Informe que o deploy foi concluído

Nunca use --force. Nunca pule etapas.
