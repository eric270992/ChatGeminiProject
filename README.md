# Configuració de Secrets: `appsettings.secrets.json`

Aquest projecte requereix un fitxer `appsettings.secrets.json` per emmagatzemar informació sensible, com ara la **clau API**. Aquest fitxer **no es troba al repositori** per motius de seguretat.

## 📌 **Com crear `appsettings.secrets.json`?**

1. A la carpeta arrel del projecte `.NET`, crea un fitxer anomenat **`appsettings.secrets.json`**.
2. Insereix-hi el contingut següent:

```json
{
  "ApiKey": "POSAR_API_KEY"
}
