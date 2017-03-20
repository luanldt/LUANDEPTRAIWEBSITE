

$("#frmAdd").validate();

$("#frmAdd").on('submit', function (e) {
    if($(this).valid()) {
        var formData = new FormData($(this)[0]);
        if (window.update == false) {
            $.ajax({
                url: "",
                type: "POST",
                data: formData,
                contentType: false,
                processData: false
            }).done(function (data) {
                window.location.reload(true);
            }).fail(function () {
                $('button[type="reset"]').click();
            });

        } else {
            $.ajax({
                url: "/Admin/Projects/update",
                type: "POST",
                data: formData,
                contentType: false,
                processData: false
            }).done(function (data) {
                window.location.reload(true);
            }).fail(function () {
                alert("Update fail!")
            });
        }
    }
    e.preventDefault();
});

$(document).ready(function () {
    window.update = false;

    $('.delete').click(function (e) {
        fetch('', {
            method: 'delete',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id: $(this).data('id')
            })
        })
            .then(res => {
                console.log(res);
                if (res.ok) return res.json();
            })
            .then(data => {
                console.log(data);
                window.location.reload(true);
            });

        e.preventDefault();
    });


    $('.edit').click(function (e) {
        var project;
        $.ajax({
            url: "/Admin/Projects/edit/" + $(this).data('id'),
            type: "GET"
        }).done(function (data) {
            project = data;
            console.log(project);
            $('#modelProject').on('shown.bs.modal', function () {
                window.update = true;
                $('#gridSystemModalLabel').text('Edit Project');
                $('input[name="name"]').val(project['Name']);
                $('select[name="using"]').val(project['Using']);
                $('textarea[name="description"]').val(project['Description']);
                $('input[name="position"]').val(project['Position']);
                $('input[name="show"]').prop('checked', project['Show']);
                $('input[name="id"]').val(project['_id']);
                for (var i = 0; i < project['Images'].length; i++) {
                    $('#imgView').append("<img width='50' src='/images/" + project['Images'][i] + "'>")
                }
                $('input[name="duration"]').val(project['Duration'][0] + ' - ' + project['Duration'][1]);
            });
            $('#modelProject').modal('show');
        }).fail(function () {
            window.location.reload(true);
        });

        e.preventDefault();
    });

});
