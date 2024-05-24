let uploadedFilename = '';

function uploadData() {
    var formData = new FormData(document.getElementById('upload-form'));

    $.ajax({
        url: '/upload',
        type: 'POST',
        data: formData,
        contentType: false,
        processData: false,
        success: function(response) {
            $('#prediction-result-upload').html('<p>' + response.message + '</p>');
            if (response.filename) {
                uploadedFilename = response.filename;
            }
            $('#prediction-result-upload').append('<button class="btn btn-secondary" onclick="analyseData()">Analyse</button>');
            var resultContainer = $('.prediction-result-container');
            resultContainer.css('display', 'block');
            setTimeout(function() {
                resultContainer.addClass('show');
            }, 10); // css transition
        },
        error: function(jqXHR, textStatus, errorThrown) {
            $('#prediction-result-upload').html('<p>Error: ' + textStatus + '</p>');
            var resultContainer = $('.prediction-result-container');
            resultContainer.css('display', 'block');
            setTimeout(function() {
                resultContainer.addClass('show');
            }, 10); // css transition
        }
    });
}

function analyseData() {
    // Spinner
    $('#new-card-container').html('<div class="spinner"></div>');
    $('.spinner').show();

    setTimeout(function() {
        $.ajax({
            url: '/analyse',
            type: 'GET',
            data: { filename: uploadedFilename },
            success: function(response) {
                $('.spinner').hide();

                var newCardHtml = `
                    <div class="content">
                        <div class="card">
                            <div class="filter">
                                <a class="icon" href="#" data-bs-toggle="dropdown"><i class="bi bi-three-dots"></i></a>
                                <ul class="dropdown-menu dropdown-menu-end dropdown-menu-arrow">
                                    <li class="dropdown-header text-start">
                                        <h6>Filter</h6>
                                    </li>
                                    <li><a class="dropdown-item" href="#">Transactions</a></li>
                                    <li><a class="dropdown-item" href="#">Customers</a></li>
                                    <li><a class="dropdown-item" href="#">Product</a></li>
                                    <li><a class="dropdown-item" href="#">Employee</a></li>
                                </ul>
                            </div>
                            <div class="card-body">
                                <h5 class="card-title">CSV Data <span>Preview</span></h5>
                                <div class="table-hover-effect">${response.head_html}</div>
                                
                            </div>
                        </div>
                    </div>
                `;
                $('#new-card-container').append(newCardHtml);

                 applyColumnHoverEffect();
            },
            error: function(jqXHR, textStatus, errorThrown) {
                $('.spinner').hide();
                alert('Error fetching data: ' + textStatus);
            }
        });
    }, 1000); // spinner delay
}

function applyColumnHoverEffect() {
    const table = document.querySelector('.table-hover-effect table');
    if (!table) return;

    const rows = table.querySelectorAll('tr');
    rows.forEach(row => {
        row.querySelectorAll('th, td').forEach((cell, index) => {
            cell.addEventListener('mouseover', () => {
                rows.forEach(row => {
                    row.cells[index].classList.add('hovered');
                });
            });

            cell.addEventListener('mouseout', () => {
                rows.forEach(row => {
                    row.cells[index].classList.remove('hovered');
                });
            });
        });
    });
}

function updateFileName() {
    var fileName = document.getElementById('file-upload').value.split('\\').pop();
    document.getElementById('file-name').textContent = fileName;
}
