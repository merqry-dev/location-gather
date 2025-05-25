let collectedData = {
    ipContinent: null,
    ipCountry: null,
    ipCity: null,
    ipLatitude: null,
    ipLongitude: null,
    ip: null,
    as: null,
    gpsLatitude: null,
    gpsLongitude: null,
    realLocation: null,
    isGPS: null
};

async function getIPGeolocationData() {
    try {
        let url = 'http://ip-api.com/json/?fields=continent,country,city,lat,lon,as,query'
        const ipRequest = new Request(url)
        const response = await fetch(ipRequest, { cache: "no-store" })
        const ipJsonDetails = await response.json()
        console.log(ipJsonDetails)

        collectedData.ipContinent = ipJsonDetails.continent;
        collectedData.ipCountry = ipJsonDetails.country;
        collectedData.ipCity = ipJsonDetails.city;
        collectedData.ipLatitude = ipJsonDetails.latitude;
        collectedData.ipLongitude = ipJsonDetails.longitude;
        collectedData.as = ipJsonDetails.as;
        collectedData.ip = ipJsonDetails.query;
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
        const response = await fetch("https://locationfunction.azurewebsites.net/api/location", {
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
