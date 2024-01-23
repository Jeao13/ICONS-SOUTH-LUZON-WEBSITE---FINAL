
let active_button = 'all_button';

function filter(category) {
    var categories = [
        'pcieer',
        'pcaarrd',
        'priv',
        'acad',
        'fab',
        'private'
    ]

    if (active_button == category) return;
    var elements = [];
    for (const categ of categories) {
        if (categ == category || category == 'all') {

            if (category == 'all') {
                elements = document.getElementsByClassName(categ);
            } else {
                elements = document.getElementsByClassName(category);
            }
            console.log(category)

            for(var i = 0; i < elements.length; i++) {
                elements[i].style.display = 'block';
            }
            if (category == 'all' || categ == category) continue;
        };
        elements = document.getElementsByClassName(categ);
        for(var i = 0; i < elements.length; i++) {
            elements[i].style.display = 'none';
        } 
    }

    button = document.getElementById(active_button);

    button.classList.remove("underline");

    console.log(`${category}_button`)
    
    active_button = `${category}_button`

    new_active_button = document.getElementById(active_button);
    new_active_button.classList.add("underline")
    new_active_button.classList.add("underline-offset-8")
    new_active_button.classList.add("decoration-red-500")

     
}

