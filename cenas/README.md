# Cenas dos episódios

Envie manualmente as imagens de cada episódio dentro desta pasta, seguindo a mesma organização usada nos dados da HQ:

```text
cenas/<serie-id>/temporada-<numero>/episodio-<numero-com-2-digitos>/00.webp
cenas/<serie-id>/temporada-<numero>/episodio-<numero-com-2-digitos>/01.webp
cenas/<serie-id>/temporada-<numero>/episodio-<numero-com-2-digitos>/02.webp
```

Exemplo para `solarion-t1e01`:

```text
cenas/solarion/temporada-1/episodio-01/00.webp
cenas/solarion/temporada-1/episodio-01/01.webp
cenas/solarion/temporada-1/episodio-01/02.webp
```

O leitor procura automaticamente as cenas na ordem `00`, `01`, `02`, `03` e assim por diante. A busca para no primeiro número que não existir. Os formatos aceitos são `.webp`, `.jpg`, `.jpeg`, `.png`, `.avif` e `.gif`.

Se um episódio precisar usar outra pasta, defina o campo `pastaCenas` no `dados.json` do episódio com o caminho desejado.
