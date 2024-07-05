const apiKey = 'YR3_bJ9inqhrXAurnX4tVCG5MFZmfdrrBFZ6RIb7G1w';

    const displayWallpapers = (images) => {
        const wallpapersDiv = document.getElementById('wallpapers');
        wallpapersDiv.innerHTML = '';
        images.forEach(image => {
            const imgElement = document.createElement('div');
            imgElement.classList.add('col-md-4');
            imgElement.innerHTML = `
                <div class="card">
                    <img src="${image.urls.small}" class="card-img-top" alt="${image.alt_description}">
                    <div class="card-body text-center">
                        <button class="btn btn-primary mb-2 download-btn" data-url="${image.urls.full}">Download</button>
                        <div class="progress">
                            <div class="progress-bar progress-bar-striped progress-bar-animated" role="progressbar"></div>
                        </div>
                        <div class="download-message">Downloaded from NJB Server</div>
                    </div>
                </div>
            `;
            wallpapersDiv.appendChild(imgElement);
        });

        document.querySelectorAll('.download-btn').forEach(button => {
            button.addEventListener('click', async (event) => {
                const url = event.target.getAttribute('data-url');
                const cardBody = event.target.parentElement;
                const progressBar = cardBody.querySelector('.progress-bar');
                const downloadMessage = cardBody.querySelector('.download-message');
                try {
                    const response = await axios({
                        url: url,
                        method: 'GET',
                        responseType: 'blob',
                        onDownloadProgress: (progressEvent) => {
                            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                            progressBar.style.width = `${percentCompleted}%`;
                        }
                    });
                    const urlCreator = window.URL || window.webkitURL;
                    const imageUrl = urlCreator.createObjectURL(response.data);
                    const link = document.createElement('a');
                    link.href = imageUrl;
                    link.download = 'wallpaper.jpg';
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    downloadMessage.style.display = 'block';
                } catch (error) {
                    console.error('Error downloading image:', error);
                }
            });
        });
    };

    const fetchWallpapers = async (query = '') => {
        try {
            const response = await axios.get('https://api.unsplash.com/photos/random', {
                params: {
                    count: 12,
                    query,
                    client_id: apiKey
                }
            });
            displayWallpapers(response.data);
        } catch (error) {
            console.error('Error fetching images:', error);
        }
    };

    document.getElementById('search-input').addEventListener('input', (event) => {
        const query = event.target.value;
        fetchWallpapers(query);
    });

    document.addEventListener('DOMContentLoaded', () => {
        fetchWallpapers();
    });
