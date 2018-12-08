// dependencies
const homeButton = document.getElementById('homeButton')
const saveArticles = document.getElementById('saveArticles')
const scrapeAll = document.getElementById('scrapeAll')
const deleteAll = document.getElementById('deleteAll')
// const deleteSave = document.getElementByClassName('save')

document.addEventListener("DOMContentLoaded", function(event) {
    $.ajax({
        url: "/scrape",
        method: "GET",
    })
    console.log("scraping done")
});

scrapeAll.addEventListener('click', function() {
    $.getJSON("/all", function(data) {
        console.log(data);
        for (let i = 0; i < data.length; i++) {
            // Send a "Scrape Complete" message to the browser
            const cardDiv = $('<div id="' + data[i]._id + '" class="uk-card uk-card-default uk-width-1-2@m">')
            const cardHeader = $('<div class="uk-card-header">')
            const cardTitle = $('<h3 class="uk-card-title uk-margin-remove-bottom">' + data[i].title + '</h3>')
            const cardBody = $('<div class="uk-card-body">')
            const cardSummary = $('<p>' + data[i].summary + '</p>')
            const cardFooter = $('<div class="uk-card-footer">')
            const cardAction = $('<a class="uk-button uk-button-default" href="' + data[i].link + '">Read more</a>')
            const save = $('<a class="uk-button uk-button-default save">Save</a>')
            cardFooter.append(cardAction)
            cardFooter.append(save)
            cardBody.append(cardSummary)
            cardHeader.append(cardTitle)
            cardDiv.append(cardHeader)
            cardDiv.append(cardBody)
            cardDiv.append(cardFooter)
            // Push API call to html
            $('#scrapeOutput').append(cardDiv)
        }
    })
})

deleteAll.addEventListener('click', function() {

    $.getJSON("/clearall", function(data) {
        console.log(data)
    })
    $('uk-card').remove();
    location.reload() 
})

saveArticles.addEventListener('click', function() {

    $.getJSON("/update/" + _id, function(data) {
        console.log(data)
    })
    $('#scrapeOutput').hide();
    $('#saveOutput').show();
})

homeButton.addEventListener('click', function() {
    $('#scrapeOutput').show();
    $('#saveOutput').hide();
})