export default async function handler(req, res) {
    const url = "http://rynox.top/get.php?username=82481120&password=03392322&type=m3u_plus&output=ts";

    try {
        const response = await fetch(url);
        const data = await response.text();

        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader("Content-Type", "text/plain");

        res.status(200).send(data);
    } catch (err) {
        res.status(500).send("Erro ao carregar M3U");
    }
}
