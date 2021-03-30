// Oscar Pinedo script.js
// https://api.nasa.gov/assets/insight/InSight%20Weather%20API%20Documentation.pdf
var api_key = "O0Tggg3QdrHyMGqb6fhPe0Z9KLtQBeUpTI1JVeFI";
var demo_key ="DEMO_KEY";
$(document).ready(function() {
    refresh();
    console.log("document is ready");

    $('#valid').click(function(){
        // var number_of_users = $('input').val()
        // Clears the data anytime a new function is clicked
        refresh();
        // connects to api
        $.ajax({
            url: `https://api.nasa.gov/insight_weather/?api_key=${api_key}&feedtype=json&ver=1.0`,
            dataType: "json",
            success: function(res){
                var keys = res.sol_keys;
                // console.log(res);
                var data = res;
                var sol = "";
                var html_string = "";
                for(var i = 0; i < keys.length; i++){
                    // console.log("sol number now is: " + keys[i]);
                    sol = keys[i]
                    html_string +=  `<div class='col-12 col-sm-6 col-md-4'>
                                        <div class='card my-1 p-2 bg-transparent'>
                                            <h5 class="text-black mb-0"> Sol ${sol}</h5>
                                            <h6 class="text-success mt-0">${convertDate(data[sol].First_UTC)}</h6>
                                                <p class="card-text">Readings below will only show when Insight has collected 
                                                sufficient data values to consider the data set valid.
                                                </p>
                                                <h5 class="text-info">${capitalize(data[sol].Season)}</h5>
                                                `
                    // Get temperature data
                    html_string += getMeasuredValues(data[sol].AT, "F");
                    // Get wind speed data
                    html_string += getMeasuredValues(data[sol].HWS, "m/s");
                    // Get atmosphere pressure
                    html_string += getMeasuredValues(data[sol].PRE, "Pa");
                    // closes of final divs
                    html_string +=      `</div>
                                    </div>`
                }
                $('.data-cards').append(html_string);
                
            }

        })
    })

    $('#all').click(function(){
        // var number_of_users = $('input').val()
        // Clears the data anytime a new function is clicked
        // $('.data-cards').children().remove()
        refresh();
        // gets info from api and manipulatesit
        $.ajax({
            url: `https://api.nasa.gov/insight_weather/?api_key=${api_key}&feedtype=json&ver=1.0`,
            dataType: "json",
            success: function(res){
                var keys = res.validity_checks.sols_checked;
                // console.log(res);
                var data = res;
                var sol = "";
                var html_string = "";
                for(var i = 0; i < keys.length; i++){
                    // console.log("sol number now is: " + keys[i]);
                    sol = keys[i]
                    html_string +=  `<div class='col-12 col-sm-6 col-md-4'>
                                        <div class='card my-1 p-2 bg-transparent'>
                                            <h5 class="text-black mb-0"> Sol ${sol}</h5>`
                    if(data.validity_checks[sol].PRE.valid){

                    html_string +=             `<h6 class="text-success mt-0">${convertDate(data[sol].First_UTC)}</h6>
                                                <p class="card-text">Readings below will only show when Insight has collected 
                                                sufficient data values to consider the data set valid.
                                                </p>
                                                <h5 class="text-info">${capitalize(data[sol].Season)}</h5>
                                                `
                    // Get temperature data
                    html_string += getMeasuredValues(data[sol].AT, "F");
                    // Get wind speed data
                    html_string += getMeasuredValues(data[sol].HWS, "m/s");
                    // Get atmosphere pressure
                    html_string += getMeasuredValues(data[sol].PRE, "Pa");
                    // closes of final divs
                    html_string +=      `</div>
                                    </div>`
                    /* Output for cards without any data that has been collected */
                    }else{
                        // console.log("No data availavle for sol: %s", keys[i]);
                        html_string += `<h6 class="text-dark mt-0">No data has been collected for this day.</h6>
                                        <p class="card-text">Readings below will only show when Insight has collected 
                                        sufficient data values to consider the data set valid.
                                        </p>
                                        
                                        <p class="card-text text-warning"> For this particular day no data has been validated so
                                        we have nothing to show.
                                        </p>`
                                        
                        html_string +=      `</div>
                        </div>`
                    }

                }
                $('.data-cards').append(html_string);
                
            }

        })
    })
})

$(document).on("click", "#clear", function () {
    refresh();
})



$(document).on("click", "#query", function (e) {
    refresh();
    var sol_query = $('input').val()
    query_sol_day(sol_query)
})



// to clear and refresh the page
function refresh(){
    $.ajax({
        url: `https://api.nasa.gov/insight_weather/?api_key=${api_key}&feedtype=json&ver=1.0`,
        dataType: "json",
        success: function(res){
            $('.data-cards').children().remove();
            var keys = res.validity_checks.sols_checked;
            // console.log(res);
            var data = res;
            var sol = "";
            var html_string = "";
            html_string +=  `<div class="container text-center sol-list my-0"> 
                                <p class="text-dark align-center font-weight-bold m-0 p-2">${getAllSols(keys)}</p>
                            </div>`

            $('.data-cards').append(html_string);
            
        }
    })
}

/* Query for a spcific day */
function query_sol_day(day){
    $.ajax({
        url: `https://api.nasa.gov/insight_weather/?api_key=${api_key}&feedtype=json&ver=1.0`,
        dataType: "json",
        success: function(res){
            var keys = res.sol_keys;
            var data = res;
            var sol = "";
            var html_string = "";
            var found = false;
            for(var i = 0; i < keys.length; i++){
                if(keys[i] == day){
                    sol = keys[i]
                    html_string +=  `<div class='col-12 col-sm-6 col-md-4'>
                                        <div class='card my-1 p-2 bg-transparent'>
                                            <h5 class="text-black mb-0"> Sol ${sol}</h5>
                                            <h6 class="text-success mt-0">${convertDate(data[sol].First_UTC)}</h6>
                                                <p class="card-text">Readings below will only show when Insight has collected 
                                                sufficient data values to consider the data set valid.
                                                </p>
                                                <h5 class="text-info">${capitalize(data[sol].Season)}</h5>
                                                `
                    // Get temperature data
                    html_string += getMeasuredValues(data[sol].AT, "F");
                    // Get wind speed data
                    html_string += getMeasuredValues(data[sol].HWS, "m/s");
                    // Get atmosphere pressure
                    html_string += getMeasuredValues(data[sol].PRE, "Pa");
                    // closes of final divs
                    html_string +=      `</div>
                                    </div>`
                    found = true;
                }
            }
            // Only gives alert when day is not found
            if(!found){
                // console.log("Not a valid day");
                html_string += `<div class="alert alert-warning mt-3 text-center text-danger" role="alert">
                                ${day} is not a valid input, please see recent data collected and input the number value only.
                                If value is listed then the data for the day has not been validated.
                                </div>`
            }
            $('.data-cards').append(html_string);
            
        }
    })
}

/* Below are some of the logical functions that clean up or organize or data 
    in oder to keep our ajax calls more readable.
*/

// Converts our UTC time to a more readable format
function convertDate(date){
    var ret = new Date(date);
    return ret.toDateString();
}

// Capitalized our string output
function capitalize(string) 
{
    return string.charAt(0).toUpperCase() + string.slice(1);
}

// Appends the data for the selected inputs from the api
function getMeasuredValues(data, units){
    var add_str = "";
    var measurement = "";
    if(units == "F"){
        measurement = "Temperature";
    }else if( units == "Pa"){
        measurement = "Pressure";
    }else if( units = "m/s"){
        measurement = "Wind Speed";
    }
    if(data == undefined){
        // console.log("No data available");
        add_str += `<div class="container-flush">
                        <h6 class="text-black mb-0 mt-2 font-weight-bold">${measurement}</h6>
                        <p class="text-muted"> Data is not available </p>
                    </div>`
    }else{
        // console.log(data);
        add_str +=  `<div class="container-flush">
                            <h6 class="text-black mb-0 mt-2 font-weight-bold">${measurement}</h6>
                            <p class="">${data.ct} Samples</p>
                            <ul class="list-group list-group-flush">
                                <li class="list-group-item bg-transparent p-1 text-danger">High: ${data.mx} ${units}</li>
                                <li class="list-group-item bg-transparent p-1 text-primary">Low: ${data.mn} ${units}</li>
                                <li class="list-group-item bg-transparent p-1 text-warning">Avg: ${data.av} ${units}</li>
                            </ul>
                        </div>`;
    }
    return add_str;
}

// Gets all of the recent sol keys wether data is available or not
function getAllSols(keys){
    var str = "Recent data collection attempts for ";
    for(var i = 0; i < keys.length; i++){
        str += "Sol " + keys[i];
        if(i != (keys.length - 1)){
            str += ", ";
        }
    }
    return str;
}
