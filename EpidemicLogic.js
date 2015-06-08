$(document).ready(function (){
    //    showLoadingScreen();
    nextButton.click(function() {
        advanceIntro();
    })
    backButton.click(function() {
        goBackIntro()
    })
    $(".disease-name-button").click(function(){enterDiseaseName()})
    $(".infection-agent-button1").click(function(){enterInfectionAgent($(".infection-agent-button1").text())})
    $(".infection-agent-button2").click(function(){enterInfectionAgent($(".infection-agent-button2").text())})
    $(".transmission-agent-button1").click(function(){enterTransmissionAgent($(".transmission-agent-button1").text())})
    $(".transmission-agent-button2").click(function(){enterTransmissionAgent($(".transmission-agent-button2").text())})
    $(".transmission-agent-button3").click(function(){enterTransmissionAgent($(".transmission-agent-button3").text())})
    $(".transmission-agent-button4").click(function(){enterTransmissionAgent($(".transmission-agent-button4").text())})
    $(".transmission-agent-button5").click(function(){enterTransmissionAgent($(".transmission-agent-button5").text())})
    $(".starting-location-button1").click(function(){enterStartingLocation($(".starting-location-button1").text())})
    $(".starting-location-button2").click(function(){enterStartingLocation($(".starting-location-button2").text())})
    $(".starting-location-button3").click(function(){enterStartingLocation($(".starting-location-button3").text())})
    $(".starting-location-button4").click(function(){enterStartingLocation($(".starting-location-button4").text())})
});

function showLoadingScreen() {
    var progressBar = $("#loading-progress-bar");
    progressBar.animate({width: "100%"}, 5000, "swing", function(){
        $(".progress").animate({opacity: 0}, 1000, "swing", function() {
            $("#loading-progress").animate({opacity: 0}, 1000, "swing", function() {
                $("#loading-progress").remove()
                initializeGame()
            })
        })
    });
}

function initializeGame() {
    $(".game").animate({opacity: "1"}, 1000, "swing", function(){

    })
}

var currentScreen = 0;
var headerLabel = $("#intro-text")
var nextButton = $("#intro-button")
var backButton = $("#intro-back-button")

var introText = {
    0: "Welcome to the disease simulation game.",
    1: "In this simulation you will create a disease and pick its characteristics. Every characteristic has a value that will affect your infective factor, which determines how many more people you will infect per week.",
    2: "Your goal is to infect the entire USA population of 300 million.",
    3: "As your disease infects more people there will be a response to the disease. Scientists will begin to research a cure for the disease, and the government will take preventative actions to try and control its spread. If the cure is discovered before you infect the country, you lose.",
    4: "At several points throughout the game your disease will have the opportunity to mutate in order to infect more people. You will be able to choose this mutation, and your choice will infect your disease's infection factor.",
    5: "Are you ready to begin?"
}
function advanceIntro(){
    backButton.show()
    currentScreen += 1
    if (currentScreen === 5){
        nextButton.text("Start Simulation")
    } else if (currentScreen === 6){
        currentScreen = 0
        beginDiseaseCreation()
    }
    headerLabel.text(introText[currentScreen])
}
function goBackIntro(){
    currentScreen -= 1
    headerLabel.text(introText[currentScreen])
    if (currentScreen === 0){
        backButton.hide()
    }
}

var diseaseNameChoice = $("#disease-name-choice")
var infectionAgentChoice = $("#infection-agent-choice")
var startingTransmissionChoice = $("#starting-transmission-choice")
var startingLocationChoice = $("#starting-location-choice")
var screens = {
    0: diseaseNameChoice,
    1: infectionAgentChoice,
    2: startingTransmissionChoice,
    3: startingLocationChoice
}

function beginDiseaseCreation() {
    $("#intro").hide()
    screens[currentScreen].show()
}
function advanceDiseaseCreation() {
    screens[currentScreen].hide()
    if (currentScreen === 3){
        $("#game-stats").show()
        $(".gap").show()
        $(".content").css("margin-bottom", "-175px")

        startSimulation()
    } else{
        currentScreen += 1
        screens[currentScreen].show()
    }
}

function enterDiseaseName(){
    var name = $("#disease-name-field").val()
    $("#header-text").text(name)
    diseaseName = name
    advanceDiseaseCreation()
}
function enterInfectionAgent(infectionAgentString){
    infectiveAgent = infectionAgentString
    advanceDiseaseCreation()
}
var transmissionTypesArray = [];
var transmissionTypesLabel = $("#transmission-types")
function enterTransmissionAgent(transmissionAgentString){
    transmissionTypesArray.push(transmissionAgentString)
    advanceDiseaseCreation()
}
function enterStartingLocation(startingLocationString){
    startingLocation = startingLocationString
    advanceDiseaseCreation()
}

var diseaseName = null
var infectiveAgent = null;
var infectiveAgentLabel = $("#infective-agent")
var startingLocation = null;
var startingLocationLabel = $("#origin")

function startSimulation(){
    // INFECTION FACTOR FORMULA
    var infectiveAgentFormulaValues = {"Virus": 1.5, "Bacteria": 1.2};
    var carrierSpeciesFormulaValues = {"Human": 1, "Mosquito": 1.3,  "Bird": 1.15, "Chicken": 1.1, "Pig": 1.02};
    var transmissionTypeFormulaValues = {"Airborne": 1.8, "Surface Contact": 1.3, "Water": 1.1, "Contact with Infected": 1.2, "Bodily Fluids": 1.1};
    var startingLocationFormulaValues = {"NYC": 2, "LA": 1.3, "Philadelphia": 1.2, "El Paso": 1.05};
    var symptomTimeFormulaValues = {"Sooner": 0.5, "Later": 1.9};

    function calculateInfectionFactor(){
        var counter = 0;

        counter += infectiveAgentFormulaValues[infectiveAgent];
        counter += startingLocationFormulaValues[startingLocation];

        if (carrierSpeciesArray.length !== 0) {
            for (var carrierIndex in carrierSpeciesArray){
                counter += carrierSpeciesFormulaValues[carrierSpeciesArray[carrierIndex]];
            }
        }

        if (transmissionTypesArray.length !== 0) {
            for (var transmissionIndex in transmissionTypesArray){
                counter += transmissionTypeFormulaValues[transmissionTypesArray[transmissionIndex]];
            }
        }

        if (symptomTimeString !== null) {
            counter += symptomTimeFormulaValues[symptomTimeString];
        }

        counter += Math.floor((Math.random() * 1.1) + 1.5);
        counter -= Math.floor((Math.random() * 1.1) + 1.5);

        return counter
    }

    function calculateDiseaseStatus(){
        for (var status in diseaseStatusTypes){
            if (numberOfInfected >= diseaseStatusTypes[status]){
                continue;
            } else{
                return status;
            }
        }
    }

    function setDiseaseProgress(){
        numberOfInfected += (numberOfInfected/2)*infectionFactor;
        percentageOfCountryInfected = (numberOfInfected / winningNumber) * 100;
    }

    // CURE FORMULA
    var cureStartingNumber = 10000;
    var cureProgressBegan = false;

    function setCureProgress(){
        if (numberOfInfected >= 10000){
            if (cureProgressBegan === false){
                cureProgressBegan = true;
            } else {
                cureProgressPercentage += Math.floor((Math.random() * 2.5) + 4.5 + (numberOfInfected/Math.pow(10, 7.5)) + 1) * 1.14;
                cureProgressPercentage += Math.floor((Math.random() * 4.1) + 9.5);
                cureProgressPercentage -= Math.floor((Math.random() * 3.1) + 8.5);
            }
        }
    }

    function setbackCureProgress(){
        cureProgressPercentage -= Math.floor((Math.random() * 3.5) + 2.5 + (numberOfInfected/Math.pow(10, 7.5)));
    }


    // DEFINITIONS
    var diseaseStatusTypes = {
        "Outbreak": 500, 
        "Endemic": 5000, 
        "Epidemic": 100000, 
        "Bigger Epidemic": 1000000, 
        "Huge Epidemic": 50000000, 
        "Pandemic": 225000000,
    };

    // PLOT POINTS

    function getAvailableCarrierSpecies(){
        var availableSpecies = [];
        for (var species in carrierSpeciesFormulaValues){
            if (($.inArray(species, carrierSpeciesArray) === -1)){
                availableSpecies.push(species);
            }
        }
        return availableSpecies.join(" ");
    }

    function getAvailableTransmissionTypes(){
        var availableTypes = [];
        for (var type in transmissionTypeFormulaValues){
            if ($.inArray(type, transmissionTypesArray) === -1){
                availableTypes.push(type);
            }
        }
        return availableTypes.join(",");
    }
    
    function carrierSpeciesFormatIntoButtons(stringArray, divName){
        for (var string in stringArray){
            var buttonHTML = "<button class='btn' id='" + string + "'>" + stringArray[string] + "</button>"
            $(divName).append(buttonHTML)
        }
        $("#0").click(function(){carrierSpeciesArray.push($("#0").text()); $(divName).remove();plotPointDiv.show();gameInterval = setInterval(logic, 3000); summarizeStats()})
        $("#1").click(function(){carrierSpeciesArray.push($("#1").text()); $(divName).remove();plotPointDiv.show();gameInterval = setInterval(logic, 3000); summarizeStats()})
        $("#2").click(function(){carrierSpeciesArray.push($("#2").text()); $(divName).remove();plotPointDiv.show();gameInterval = setInterval(logic, 3000); summarizeStats()})
        $("#3").click(function(){carrierSpeciesArray.push($("#3").text()); $(divName).remove();plotPointDiv.show();gameInterval = setInterval(logic, 3000); summarizeStats()})
    }
    function transmissionTypesFormatIntoButtons(stringArray, divName){
        for (var string in stringArray){
            var buttonHTML = "<button class='btn' id='" + string + "'>" + stringArray[string] + "</button>"
            $(divName).append(buttonHTML)
        }
        $("#0").click(function(){transmissionTypesArray.push($("#0").text()); $(divName).remove();plotPointDiv.show();gameInterval = setInterval(logic, 3000); summarizeStats()})
        $("#1").click(function(){transmissionTypesArray.push($("#1").text()); $(divName).remove();plotPointDiv.show();gameInterval = setInterval(logic, 3000); summarizeStats()})
        $("#2").click(function(){transmissionTypesArray.push($("#2").text()); $(divName).remove();plotPointDiv.show();gameInterval = setInterval(logic, 3000); summarizeStats()})
        $("#3").click(function(){transmissionTypesArray.push($("#3").text()); $(divName).remove();plotPointDiv.show();gameInterval = setInterval(logic, 3000); summarizeStats()})
    }
    function symptomTimeStringFormatIntoButtons(stringArray, divName){
        for (var string in stringArray){
            var buttonHTML = "<button class='btn' id='" + string + "'>" + stringArray[string] + "</button>"
            $(divName).append(buttonHTML)
        }
        $("#0").click(function(){symptomTimeString = $("#0").text();$(divName).remove();plotPointDiv.show();gameInterval = setInterval(logic, 3000); summarizeStats()})
        $("#1").click(function(){symptomTimeString = $("#1").text();$(divName).remove();plotPointDiv.show();gameInterval = setInterval(logic, 3000); summarizeStats()})
    }

    var achievedPlotPoints = [];
    var plotPointDiv = $("#plot-points")
    var gameContentDiv = $("#game-content")

    function showPlotPoints(){
        for (var point in plotPointDictionary){
            if (numberOfInfected >= point && ($.inArray(point, achievedPlotPoints) === -1)){
                achievedPlotPoints.push(point);
                plotPointDiv.append("<h2 id='" + point + "' style='margin-top: 15px'>Week " + week + ": " +   plotPointDictionary[point] + "</h2")
                var scrollTo = document.getElementById(point).offsetTop
                $("#game-content").scrollTop(scrollTo)
                showMutationPoints(point);
                showInfectionFactorDecreases(point);
            }
        }
    }

    function showMutationPoints(point) {
        switch(point){
                case "80000":
                    plotPointDiv.hide()
                    clearInterval(gameInterval)
                    setbackCureProgress();
                    var firstCarrierSpeciesMutationText = "The Government starts to quarantine infected individuals in isolation tents. This quarantine has prompted your infective agent to mutate in order to be carried on another species. Choose an additional carrier species."
                    var mutationOne = "<div id='firstCarrierSpeciesMutation' style='position: relative; top: 50%; margin-top: -65px;'> <h2> " + firstCarrierSpeciesMutationText + "</h2></div>"
                    $("#game-content").append(mutationOne)
                    carrierSpeciesFormatIntoButtons(getAvailableCarrierSpecies().split(" "), "#firstCarrierSpeciesMutation")
                    break;
                case "500000":
                    plotPointDiv.hide()
                    clearInterval(gameInterval)
                    setbackCureProgress();
                    var secondCarrierSpeciesMutationText = "Government starts to quarantine infected towns. This quarantine has prompted your infective agent to mutate in order to be carried on another species. Choose an additional carrier species."
                    var mutationOne = "<div id='secondCarrierSpeciesMutation' style='position: relative; top: 50%; margin-top: -60px;'> <h2> " + secondCarrierSpeciesMutationText + "</h2></div>"
                    $("#game-content").append(mutationOne)
                    carrierSpeciesFormatIntoButtons(getAvailableCarrierSpecies().split(" "), "#secondCarrierSpeciesMutation")
                    break;
                case "30000000":
                    plotPointDiv.hide()
                    clearInterval(gameInterval)
                    setbackCureProgress();
                    var transmissionTypeMutationText = "Underground safehouse for uninfected people opened. This has prompted your infective agent to mutate in order to be able to spread in more ways. Choose an additional transmission type."
                    var mutationThree = "<div id='transmissionTypeMutation' style='position: relative; top: 50%; margin-top: -60px;'> <h2>" + transmissionTypeMutationText + "</h2></div>"
                    gameContentDiv.append(mutationThree)
                    transmissionTypesFormatIntoButtons(getAvailableTransmissionTypes().split(","), "#transmissionTypeMutation")
                    break;
                case "190000000":
                    plotPointDiv.hide()
                    clearInterval(gameInterval)
                    setbackCureProgress();
                    var symptomTimeMutationText = "Sick people have begun to beplaced in containment chambers throughout the country. This has prompted your infective agent to mutate in order to be change the time to which an infected person shows symptoms. Choose whether symptoms should show sooner or later."
                    var mutationFour = "<div id='symptomTimeMutation' style='position: relative; top: 50%; margin-top: -70px;'> <h2> " + symptomTimeMutationText + "</h2></div>"
                    gameContentDiv.append(mutationFour)
                    symptomTimeStringFormatIntoButtons(["Sooner", "Later"], "#symptomTimeMutation")
                    break;
            }
    }

    function showInfectionFactorDecreases(point) {
        switch(point){
            case "80000":
                infectionFactor *= 0.5; 
                break;
            case "10000":
                infectionFactor *= 0.2
            case "500000":
                infectionFactor *= 0.5;
                break;
            case "15000000":
                infectionFactor *= 0.8;
                break;
            case "75000000":
                infectionFactor *= 0.5
            case "190000000":
                infectionFactor *= 0.6
                break;
            case "300000000":
                infectionFactor *= 0.65
                break;
            case "225000000":
                infectionFactor *= 0.8;
                break;
        }
    }

    var plotPointDictionary = {
        500: "News segment run on recent outbreak of " + diseaseName + ".",
        3000: "Kids withdrawn from local schools due to fear of infection.",
        10000: "Scientists have begun to take notice of " + diseaseName + " and have started research on a cure.",
        30000: "Government starts to burn dead bodies in an effort to limit the spread from dead corpses.",
        80000: "Government starts to quarantine infected individuals in isolation tents, reducing " + diseaseName + "'s infection factor.",
        100000: "Citizens of infected areas required to wear protective masks and gloves in order to limit spread, reducing " + diseaseName + "'s infection factor.",
        500000: "Government starts to quarantine infected towns, reducing " + diseaseName + "'s infection factor.",
        700000: "Cure researchers manage to isolate infective agent in a lab for extensive examination.",
        1000000: "International coalition formed to research cure spearheaded by the CDC.",
        15000000: "International travel via US airports terminated due to infection risk, reducing " + diseaseName + "'s infection factor.",
        25000000: "Presidential cabinet infected aboard Air Force One.",
        30000000: "Underground safehouse for uninfected people opened.",
        75000000: "Government tries experimental early stage treatment that cures millions of infected people.",
        190000000: "Sick people placed in containment chambers throughout the country, reducing " + diseaseName + "'s infection factor.",
        150000000: "Regional anarchy observed in the most infected areas.",
        300000000: "Bomb destruction of infected areas begins as other methods fail, reducing " + diseaseName + "'s infection factor.",
        225000000: "Evacuation of uninfected begins, reducing " + diseaseName + "'s infection factor.",
        250000000: "Last survivors lose hope.",
        299999999: "Last survivor feels alone.",
        300000000: "Entire country infected. You win."
    };

    // GAME STATS
    var winningNumber = 300000000;

    var week = 1;
    var weekLabel = $("#week-number")
    
    var numberOfInfected = 1;
    var numberOfInfectedLabel = $("#number-of-infected")
    var percentageOfCountryInfected = 0;
    var infectionProgressBar = $("#infection-progress")
    var diseaseStatus = "Outbreak";
    var diseaseStatusLabel = $("#disease-status")

    var carrierSpeciesArray = ["Human"];
    var carrierSpeciesLabel = $("#carrier-species")
    var symptomTimeString = null;

    var infectionFactor = 0;

    var cureProgressPercentage = 0;
    var cureProgressBar = $("#cure-progress")

    function summarizeStats(){
        weekLabel.text("Week " + week)
        diseaseStatusLabel.text(diseaseStatus)
        startingLocationLabel.text("Origin: " + startingLocation)
        if (numberOfInfected < 300000000){
            numberOfInfectedLabel.text(addCommas(Math.round(numberOfInfected)) + " Infected")
        } else{
            numberOfInfectedLabel.text("300,000,000 Infected")
        }
        
        if (percentageOfCountryInfected >= 100){
            infectionProgressBar.animate({width: "100%"}, 500, "swing", function(){
            
            })
            infectionProgressBar.text("100%")
        } else{
            infectionProgressBar.animate({width: percentageOfCountryInfected + "%"}, 500, "swing", function(){
            
            })
            infectionProgressBar.text(Math.round(percentageOfCountryInfected) + "%")
        }
        
        if (cureProgressPercentage >= 100){
            cureProgressBar.animate({width: "100%"}, 500, "swing", function(){
            
            })
            cureProgressBar.text("100%")
        } else if(cureProgressBegan){
            cureProgressBar.animate({width: cureProgressPercentage + "%"}, 500, "swing", function(){
            
            })
            cureProgressBar.text(Math.round(cureProgressPercentage) + "%")
        }
        infectiveAgentLabel.text(infectiveAgent)
        if (transmissionTypesArray.length !== 0){
            transmissionTypesLabel.text("Transmission types: " + transmissionTypesArray.join(" | "))
        }
        if (carrierSpeciesArray.length !== 0){
            carrierSpeciesLabel.text("Carrier species: " + carrierSpeciesArray.join(" | "))
        }

    }
    summarizeStats()
    plotPointDiv.show()
    // GAME LOGIC
    var gameInterval = gameInterval = gameInterval = setInterval(logic, 3500)
    
    function logic() {
        summarizeStats()
        if (numberOfInfected < winningNumber && cureProgressPercentage < 100){
            showPlotPoints();
            infectionFactor = calculateInfectionFactor();
            diseaseStatus = calculateDiseaseStatus();

            setDiseaseProgress();
            setCureProgress(); 
            week++
        } else if (cureProgressPercentage >= 100){
            var losePoint = "<h1 id='lose-point'>Cure for " + diseaseName + " has been discovered. You lose.</h1>"
            plotPointDiv.append(losePoint)
            var scrollTo = document.getElementById("lose-point").offsetTop
            $("#game-content").scrollTop(scrollTo)
            clearInterval(gameInterval)
        } else if (numberOfInfected >= winningNumber){
            var winPoint = "<h1 id='win-point'>Entire country infected. You win.</h1>"
            plotPointDiv.append(winPoint)
            var scrollTo = document.getElementById("win-point").offsetTop
            $("#game-content").scrollTop(scrollTo)
            clearInterval(gameInterval)
        } 
    }

}

function addCommas(str) {
    var parts = (str + "").split("."),
        main = parts[0],
        len = main.length,
        output = "",
        i = len - 1;

    while(i >= 0) {
        output = main.charAt(i) + output;
        if ((len - i) % 3 === 0 && i > 0) {
            output = "," + output;
        }
        --i;
    }
    // put decimal part back
    if (parts.length > 1) {
        output += "." + parts[1];
    }
    return output;
}