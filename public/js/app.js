// dependencies
const homeButton = document.getElementById('homeButton')
const saveArticles = document.getElementById('saveArticles')
const scrapeAll = document.getElementById('scrapeAll')
const deleteAll = document.getElementById('deleteAll')
// const deleteSave = document.getElementByClassName('save')

// Scrape articles on DOM load
document.addEventListener("DOMContentLoaded", function(event) {
    $.ajax({
        url: "/scrape",
        method: "GET",
    })
    console.log("scraping done")
});

// Switch to Home DOM
homeButton.addEventListener('click', function() {
    $('#scrapeOutput').show();
    $('#saveOutput').hide();
})

// Push scrape artiles to DOM
scrapeAll.addEventListener('click', function() {
    $('#scrapeOutput').show();
    $('#saveOutput').hide();
    $.getJSON("/all", function(data) {
        console.log(data);
        index = 1
        for (let i = 0; i < data.length; i++) {
            // Send a "Scrape Complete" message to the browser
            const cardDiv = $('<div id="' + data[i]._id + '" class="uk-card uk-card-default uk-width-1-2@m">')
            const cardHeader = $('<div class="uk-card-header">')
            const cardTitle = $('<h3 class="uk-card-title uk-margin-remove-bottom">' + data[i].title + '</h3>')
            const cardBody = $('<div class="uk-card-body">')
            const cardSummary = $('<p>' + data[i].summary + '</p>')
            const cardFooter = $('<div class="uk-card-footer">')
            const cardAction = $('<a class="uk-button uk-button-default" href="' + data[i].link + '">Read more</a>')
            const save = $('<a id="save' + index + '" class="uk-button uk-button-default save">Save</a>')
            index ++
            cardFooter.append(cardAction)
            cardFooter.append(save)
            cardBody.append(cardSummary)
            cardHeader.append(cardTitle)
            cardDiv.append(cardHeader)
            cardDiv.append(cardBody)
            cardDiv.append(cardFooter)

            // PUSH TO DOM
            $('#scrapeOutput').append(cardDiv)
        }
    })
})

// DELETE ALL
deleteAll.addEventListener('click', function() {

    $.getJSON("/clearall", function(data) {
        console.log(data)
    })
    $('uk-card').remove();
    location.reload() 
})

// Update Save Property    
$(document).on('click', '.save', function() {
    event.preventDefault()
    let userSave = {}
    const articleId  = $(this).attr("id")
    const articleSummary = $("p").text()
    const articleLink = $("a").attr("href")
    const articleTitle = $("h3").text()

    // Save vote
    userSave = {
        title: articleTitle,
        summary: articleSummary,
        link: articleLink,
        save: "yes"
    }
    console.log(userSave)

    $.ajax({
        url: "/save",
        method: 'PUT',
        data: userSave
    })
    .then(function(response) {
        location.reload()
        $('#' + articleId).remove();
    })
})

saveArticles.addEventListener('click', function() {
    $.getJSON("/saveall", function(data) {
        console.log(data);
        index = 1
        for (let i = 0; i < data.length; i++) {
            // Send a "Scrape Complete" message to the browser
            const saveDiv = $('<div id="' + data[i]._id + '" class="uk-card uk-card-default uk-width-1-2@m">')
            const saveHeader = $('<div class="uk-card-header">')
            const saveTitle = $('<h3 class="uk-card-title uk-margin-remove-bottom">' + data[i].title + '</h3>')
            const saveBody = $('<div class="uk-card-body">')
            const saveSummary = $('<p>' + data[i].summary + '</p>')
            const saveFooter = $('<div class="uk-card-footer">')
            const saveAction = $('<a class="uk-button uk-button-default" href="' + data[i].link + '">Read more</a>')
            const deleteArticle = $('<a id="delete' + index + '" class="uk-button uk-button-default delete">Delete</a>')
            index ++
            saveFooter.append(saveAction)
            saveFooter.append(deleteArticle)
            saveBody.append(saveSummary)
            saveHeader.append(saveTitle)
            saveDiv.append(saveHeader)
            saveDiv.append(saveBody)
            saveDiv.append(saveFooter)

            // PUSH TO DOM
            $('#scrapeOutput').hide();
            $('#saveOutput').show();
            $('#saveOutput').append(saveDiv)
        }
    })
})

// deleteSave.addEventListener('click', function() {

//     $.getJSON("/update/" + _id, function(data) {
//         console.log(data)
//     })
//     $('#scrapeOutput').hide();
//     $('#saveOutput').show();
// })