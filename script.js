let collectedData = {
    ipCountry: null,
    ipCity: null,
    ipLoc: null,
    ip: null,
    as: null,
    gpsLatitude: null,
    gpsLongitude: null,
    realLocation: null,
    isGPS: null
};

async function getIPGeolocationData() {
    try {
        const request = await fetch("https://ipinfo.io/json?token=8a466730a19a77")
        const jsonResponse = await request.json()

        console.log(jsonResponse)

        collectedData.ipCountry = jsonResponse.country;
        collectedData.ipCity = jsonResponse.city;
        collectedData.ipLoc = jsonResponse.loc;
        collectedData.as = jsonResponse.org;
        collectedData.ip = jsonResponse.ip;
    } catch (error) {
        console.error("IP Geolocation failed:", error);
    }
}

function geoFindMe() {
    if (!navigator.geolocation) {
        console.log("Geolocation is not supported by your browser");
        return;
    }

    navigator.geolocation.getCurrentPosition(
        (position) => {
            collectedData.gpsLatitude = position.coords.latitude;
            collectedData.gpsLongitude = position.coords.longitude;
            console.log(`Latitude: ${collectedData.gpsLatitude} °, Longitude: ${collectedData.gpsLongitude} °`);
        },
        () => {
            console.log("Unable to retrieve your location");
        }
    );
}

function main() {
    getIPGeolocationData();
    geoFindMe();
}

document.querySelector("#find-me").addEventListener("click", main);

document.querySelector("#location-form").addEventListener("submit", async (event) => {
    event.preventDefault();

    collectedData.realLocation = document.querySelector("#location").value;
    collectedData.isGPS = document.querySelector('input[name="isGPS"]:checked').value;

    console.log("Submitting data:", collectedData);

    try {
        const response = await fetch("https://locationfunction.azurewebsites.net/api/StoreLocationData", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(collectedData)
        });

        if (response.ok) {
            const result = await response.text();
            alert("Data submitted successfully: " + result);
        } else {
            alert("Failed to submit data: " + response.statusText);
        }
    } catch (error) {
        console.error("Error submitting data:", error);
        alert("Error submitting data.");
    }
});
