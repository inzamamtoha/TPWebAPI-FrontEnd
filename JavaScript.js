﻿var base64img = '';
var tableOrder = "NONE";
var searchKey = '';
const uri = "https://localhost:44397/api/TouristPlace";
//const uri = "//E:/Inzamam/EDW/Dev/TPWebAPI-FrontEnd/Index.html"

$(document).ready(function () {
    $("#createBtn").click(addPlace);
    $("#submitBtn").click(postFormData);
    $("#loadImage").change(encodeImageFileAsURL);
    $("#loadUpdateImage").change(encodeImageFileAsURL);
    $("#submitUpdateBtn").click(putUpdateData);
    $("#searchBoxVal").keyup(searchPlace);
    $("#backA").click(init);
    $("#backU").click(init);
    $("#table").on("click", ".updateBtn", updatePlace);
    $("#table").on("click", ".deleteBtn", deletePlace);
    init();
});

function init() {
    $("#init").show();
    $("#table").show();
    $("#add").hide();
    $("#update").hide();
    getPlaceData();
}

function addPlace() {
    $("#init").hide();
    $("#table").hide();
    $("#add").show();
    $("#update").hide();
    $("#addForm").find('input').each(function (index) {
        this.value = '';
    });
    $('#addForm').find('#selectCountry').val("0");
}

function updatePlace() {
    var id = this.value;
    $("#init").hide();
    $("#table").hide();
    $("#add").hide();
    $("#update").show();

    $.ajax({
        type: "GET",
        url: uri + "/" + id,
        success: function (item) {
            $("#updateForm").find('input[name="placeName"]').val(item.name);
            $("#updateForm").find('input[name="placeAddress"]').val(item.address);
            $('#updateForm').find('input[name="placeRating"]').val(item.rating);
            $('#updateForm').find('input[name="placeImg"]').val("");
            $('#updateForm').find('input[name="base64"]').val(item.picture);
            $('#updateForm').find('#selectCountry').val(item.countryId);
            $('#updateForm').find('#submitUpdateBtn').val(id.toString());
        }
    });


}

function deletePlace() {
    var id = this.value;
    var x = confirm("Are you sure to delete?");
    if (x == false) {
        return;
    } postFormData

    $.ajax({
        url: uri + "/" + id,
        type: "DELETE",
        success: function (result) {
            init();
        }
    });
}

function searchPlace() {
    var key = this.value;
    searchKey = key;
    init();
}

function putUpdateData() {
    var id = this.value;
    var placeObj = { name: 'null', address: 'null', rating: '', picture: 'null', countryId: '', id: '' };

    if ($('#updateForm').find('input[name="placeName"]').val() == '') {
        alert("Name shouldn't be empty");
        updatePlace();
        return;
    }
    else {
        placeObj.name = $("#updateForm").find('input[name="placeName"]').val();
    }

    if ($("#updateForm").find('input[name="placeAddress"]').val() == '') {
        alert("Address shouldn't be empty");
        updatePlace();
        return;
    }
    else {
        placeObj.address = $("#updateForm").find('input[name="placeAddress"]').val();
    }

    if ($('#updateForm').find('input[name="placeRating"]').val() == '' || $('#updateForm').find('input[name="placeRating"]').val() < 1 || $('#updateForm').find('input[name="placeRating"]').val() > 5) {
        alert("Rating should be 1 to 5");
        updatePlace();
        return;
    }
    else {
        placeObj.rating = $('#updateForm').find('input[name="placeRating"]').val();
    }
    if ($('#updateForm').find('input[name="placeImg"]').val() == '') {
        placeObj.picture = $('#updateForm').find('input[name="base64"]').val();
    }
    else {
        placeObj.picture = base64img;
        base64img = '';
    }
    if ($('#updateForm').find('#selectCountry').val() == '') {
        alert("Select a Country");
    }
    else {
        placeObj.countryId = $('#updateForm').find('#selectCountry').val();
    }

    placeObj.id = id;
    $.ajax({
        url: uri + "/" + id,
        type: "PUT",
        accepts: "application/json",
        contentType: "application/json",
        data: JSON.stringify(placeObj),
        success: function (result) {
            init();
        }
    });
}

function encodeImageFileAsURL() {
    var file = this.files[0];
    var reader = new FileReader();
    reader.onloadend = function () {
        base64img = reader.result;
    }
    reader.readAsDataURL(file);
}

function formValidation(id) {
    $("#init").hide();
    $("#table").hide();
    $("#add").show();
    $("#update").hide();
}

function postFormData() {
    var placeObj = { name: 'null', address: 'null', rating: '', picture: 'null', countryId: '' };

    if ($('#addForm').find('input[name="placeName"]').val() == '') {
        alert("Name shouldn't be empty");
        formValidation(0);
        return;
    }
    else {
        placeObj.name = $('#addForm').find('input[name="placeName"]').val();
    }

    if ($('#addForm').find('input[name="placeAddress"]').val() == '') {
        alert("Address shouldn't be empty");
        formValidation(0);
        return;
    }
    else {
        placeObj.address = $('#addForm').find('input[name="placeAddress"]').val();
    }

    if ($('#addForm').find('input[name="placeRating"]').val() == '' || $('#addForm').find('input[name="placeRating"]').val() < 1 || $('#addForm').find('input[name="placeRating"]').val() > 5) {
        alert("Rating should be 1 to 5");
        formValidation(0);
        return;
    }
    else {
        placeObj.rating = $('#addForm').find('input[name="placeRating"]').val();
    }
    if ($('#addForm').find('#selectCountry').val() == '0') {
        alert("Select the Country");
        formValidation(0);
        return;
    }
    else {
        placeObj.countryId = $('#addForm').find('#selectCountry').val();
    }
    if ($('#addForm').find('input[name="placeImg"]').val() == '') {
        alert("Picture shouldn't be empty");
        formValidation(0);
        return;
    }
    else {
        placeObj.picture = base64img;
        base64img = '';
    }



    $.ajax({
        type: "POST",
        accepts: "application/json",
        url: uri,
        contentType: "application/json",
        data: JSON.stringify(placeObj),
        error: function (jqXHR, textStatus, errorThrown) {
            alert("Something went wrong!");
        },
        success: function (result) {
            init();
        }
    });
}

function getPlaceData() {
    $.ajax({
        type: "GET",
        url: uri,
        success: function (data) {
            var txt = "<table>"
            txt += "<tr><th>Name</th><th>Address</th><th>Rating</th><th>Country</th><th>Image</th><th>Action</th></tr>";
            $.each(data, function (key, item) {
                if (item.name.startsWith(searchKey)) {
                    txt += "<tr><td>" + item.name + "</td><td> " + item.address + "</td><td> " + item.rating + "</td><td>" + item.country + "</td><td>" + "<img  src = '" + item.picture + "'>" + "</td> <td> <button type='button' class='updateBtn' value = " + "'" + item.id + "'" + ">Update</button> <button type='button' value = " + item.id + " class='deleteBtn' >Delete</button>" + "</td></tr>";
                }
            });
            txt += "</table>";
            $("#table").html(txt);
        }
    });
}