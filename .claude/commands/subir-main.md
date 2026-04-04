Faz o merge de dev para main e sobe para produção (Vercel). Não faz commit — assume que dev já está atualizada.

Execute em ordem:

1. `git checkout main`
2. `git merge dev --no-edit`
3. `git push origin main`
4. `git checkout dev`
5. Informe que o deploy para produção foi concluído

Nunca use --force. Nunca crie branch extra.
