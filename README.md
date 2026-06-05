# Universo HQ

Aplicação web estática para uma biblioteca digital de HQs cinematográficas, feita com HTML, CSS, JavaScript puro e JSON para publicação no GitHub Pages.

## Organização narrativa

As HQs são modeladas como séries com temporadas e episódios. Cada episódio possui metadados de cronologia e uma lista de frames.

```json
{
  "serieTitulo": "Solarion",
  "temporada": 1,
  "episodio": 1,
  "cronologia": 12,
  "frames": []
}
```

## Ordenação de frames

O player ordena frames pela numeração no início do nome do arquivo ou pelo campo `ordem`.

Nomes válidos:

- `00 - Introdução.svg`
- `01 - A Origem.svg`
- `02 - O Selo.svg`

Isso permite nomear arquivos com título descritivo sem perder a ordem correta de leitura. Mesmo que os frames estejam fora de ordem no JSON, o leitor normaliza e ordena a sequência antes de exibir o episódio.

## Narrativa por frame

Cada frame pode conter texto opcional para legendas/narração cinematográfica:

```json
{
  "ordem": 0,
  "arquivo": "00 - Introdução.svg",
  "titulo": "00 - Introdução",
  "imagem": "data/hqs/solarion/temporada-1/episodio-01/frames/00 - Introdução.svg",
  "texto": "Solarion observa o vazio cósmico."
}
```

## Páginas

- `index.html`: biblioteca, favoritos, cronologia, temporadas, batalhas e wiki.
- `hq.html`: player cinematográfico.
- `personagens.html`: enciclopédia de personagens.
- `personagem.html`: dossiê individual.
- `batalhas.html`: confrontos e HQs relacionadas.
- `admin.html`: gerador local de JSON.
