# Descripción
## A saber
Como se verá se cerró el círculo de procesamiento, a partir de un conjunto de videos, se extraen las frames, 
se infiere usando CLIP interrogator la semántica de la imagen y finalmente se reagrupan los videos, en videos
nuevos que están relacionados según similitud de esa semántica inferida.

Se usó USE (universal sentence embeddings) como primer acercamiento así que no se puede decodificar en lenguaje lo encodeado en los embeddings.

También como se ve faltan muchas cosas, sobre todo orden en el caos.

## Contenido
Acá hay un par de datasets importantes:

el `full_dataset.csv` en realidad es el básico, está compuesto por


`image (str), prompt(str), path(str)`

> una filepath completa se construye con path+image (sería como un id real)

y su prompt extraida de clip interrogator es prompt (definido en `clip_interrogator_process.ipynb`)

a partir de esto se corrió `data_preparation_semantic_transverse_interrogator.ipynb`
para generar una visualización en 3d de las imágenes (se puede ver en `interactive_plot_with_path_color_and_toggleable_legend_and_log (1).html` o vivo en https://karen-pal.github.io/semantic_explore/interactive_plot_with_path_color_and_toggleable_legend_and_log%20(1).html)

En ese mismo se corrió USE (universal sentence embeddings) para generar embeddings de la columna prompt 
generando 

`full_dataset_USE_embeddings.csv`

el full_dataset está compuesto por
`image (str), prompt(str), path(str), use_embedding_0, ... , use_embedding_511`

Length: 515

`data_preparation_semantic_transverse_interrogator.ipynb` además corre PCA con 15 clusters para generar 


`annotated_full_dataset_USE+clustering.csv`

que tiene:


```python
Index(['Unnamed: 0', 'image', 'prompt', 'path', 'use_embedding_0',
       'use_embedding_1', 'use_embedding_2', 'use_embedding_3',
       'use_embedding_4', 'use_embedding_5',
       ...
       'use_embedding_504', 'use_embedding_505', 'use_embedding_506',
       'use_embedding_507', 'use_embedding_508', 'use_embedding_509',
       'use_embedding_510', 'use_embedding_511', 'cluster', 'cluster_name'],
      dtype='object', length=518)

```
los cluster names

`cluster_to_video.ipynb` toma el dataset anotado con cluster names `annotated_full_dataset_USE+clustering.csv` y nos construye videos para cada cluster.


## Tareas : prácticas
- [ ] ordenar las notebooks para que sean legibles y el repositorio tenga estructura (fue muy orgánico)
- [ ] probar alternativas a USE - como SBERT para poder decodificar e interpolar oraciones.
- [ ] deployar para poder ver el espacio de embeddings interactivos
- [ ] seguir modificando el html para tener interactividad más interesante
- [ ] generar una notebook que llame al final del pipeline, teniendo el dataset anotado con USE embeddings, y un k, que haga k clusters y genere esos videos
- [ ] hacer un dashboard que incorpore el html con los videos generados para poder visualizar cuestiones semánticas.

## Tareas : flay
- [ ] generar una notebook o script que llame a todo el pipeline a partir de un grupo de videos
- [ ] buscar formas de hacerme la vida fácil a medida que genere más videos
- [ ] seguir pensando en estrategias para pasar esto a un sistema generativo en tiempo real
