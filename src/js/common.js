$(document).ready(function() {
    $(".filterDiv li").click(function() {
        $(".filterDiv li").removeClass("active");
        $(this).addClass("active");
    });

    $(".popupContent").magnificPopup({
        type:"inline",
        midClick: true
    });

    $(".item").each(function(i) {
        $(this).find(".popupContent").attr("href", "#work_" + i);
        $(this).find(".description").attr("id", "work_" + i);
    });
});

var containerEl = document.querySelector('.portfolioItems');
var mixer = mixitup(containerEl);
