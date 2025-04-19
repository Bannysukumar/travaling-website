// Google Maps Integration
class LocationSearch {
    constructor() {
        this.map = null;
        this.markers = [];
        this.autocomplete = null;
        this.searchInput = document.getElementById('locationSearch');
        this.mapContainer = document.getElementById('map');
        this.initialize();
    }

    async initialize() {
        try {
            // Load Google Maps script
            await this.loadGoogleMapsScript();
            
            // Initialize map
            this.map = new google.maps.Map(this.mapContainer, {
                center: { lat: 0, lng: 0 },
                zoom: 2
            });

            // Initialize autocomplete
            this.autocomplete = new google.maps.places.Autocomplete(this.searchInput, {
                types: ['(cities)'],
                componentRestrictions: { country: 'us' }
            });

            // Add autocomplete listener
            this.autocomplete.addListener('place_changed', () => {
                this.handlePlaceSelect();
            });

            // Initialize location search
            this.setupLocationSearch();
        } catch (error) {
            console.error('Error initializing maps:', error);
        }
    }

    loadGoogleMapsScript() {
        return new Promise((resolve, reject) => {
            if (window.google && window.google.maps) {
                resolve();
                return;
            }

            const script = document.createElement('script');
            script.src = `https://maps.googleapis.com/maps/api/js?key=${firebaseConfig.googleMapsApiKey}&libraries=places`;
            script.async = true;
            script.defer = true;
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }

    handlePlaceSelect() {
        const place = this.autocomplete.getPlace();
        if (place.geometry) {
            // Update map
            this.map.setCenter(place.geometry.location);
            this.map.setZoom(12);

            // Clear existing markers
            this.clearMarkers();

            // Add marker for selected place
            this.addMarker(place);

            // Update search results
            this.updateSearchResults(place);
        }
    }

    addMarker(place) {
        const marker = new google.maps.Marker({
            map: this.map,
            position: place.geometry.location,
            title: place.name
        });

        // Add info window
        const infoWindow = new google.maps.InfoWindow({
            content: `
                <div class="info-window">
                    <h3>${place.name}</h3>
                    <p>${place.formatted_address}</p>
                    ${place.rating ? `<p>Rating: ${place.rating}/5</p>` : ''}
                    <button onclick="locationSearch.selectLocation('${place.place_id}')">Select Location</button>
                </div>
            `
        });

        marker.addListener('click', () => {
            infoWindow.open(this.map, marker);
        });

        this.markers.push(marker);
    }

    clearMarkers() {
        this.markers.forEach(marker => marker.setMap(null));
        this.markers = [];
    }

    setupLocationSearch() {
        // Add search button listener
        const searchButton = document.getElementById('searchLocation');
        if (searchButton) {
            searchButton.addEventListener('click', () => {
                this.handlePlaceSelect();
            });
        }
    }

    updateSearchResults(place) {
        const resultsContainer = document.getElementById('searchResults');
        if (!resultsContainer) return;

        resultsContainer.innerHTML = `
            <div class="location-result">
                <h3>${place.name}</h3>
                <p>${place.formatted_address}</p>
                ${place.rating ? `<p>Rating: ${place.rating}/5</p>` : ''}
                ${place.photos ? `<img src="${place.photos[0].getUrl()}" alt="${place.name}">` : ''}
                <button onclick="locationSearch.selectLocation('${place.place_id}')">Select Location</button>
            </div>
        `;
    }

    async selectLocation(placeId) {
        try {
            const place = await this.getPlaceDetails(placeId);
            if (place) {
                // Store selected location
                localStorage.setItem('selectedLocation', JSON.stringify({
                    id: placeId,
                    name: place.name,
                    address: place.formatted_address,
                    location: {
                        lat: place.geometry.location.lat(),
                        lng: place.geometry.location.lng()
                    }
                }));

                // Update UI
                this.searchInput.value = place.name;
                this.updateSearchResults(place);

                // Trigger location selected event
                const event = new CustomEvent('locationSelected', {
                    detail: place
                });
                document.dispatchEvent(event);
            }
        } catch (error) {
            console.error('Error selecting location:', error);
        }
    }

    getPlaceDetails(placeId) {
        return new Promise((resolve, reject) => {
            const service = new google.maps.places.PlacesService(this.map);
            service.getDetails(
                {
                    placeId: placeId,
                    fields: ['name', 'formatted_address', 'geometry', 'rating', 'photos']
                },
                (place, status) => {
                    if (status === google.maps.places.PlacesServiceStatus.OK) {
                        resolve(place);
                    } else {
                        reject(new Error('Failed to get place details'));
                    }
                }
            );
        });
    }
}

// Initialize location search
const locationSearch = new LocationSearch(); 