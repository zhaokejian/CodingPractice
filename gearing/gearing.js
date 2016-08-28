var WIDTH = 960,
    HEIGHT = 500,
    RADIUS = 80,
    X = Math.sin(2 * Math.PI / 3),
    Y = Math.cos(2 * Math.PI / 3);

var offset = 0,
    speed = 4;

function initializeGear(){
    initialSVG('body', "svg");

    var g = document.createElementNS("http://www.w3.org/2000/svg","g");
        g.setAttribute("id", "main");
        g.setAttribute("transform", "translate(480, 250) scale(.55)");

    $('#svg').append(g);

    //annulus
    addGroup("main", "annulus", 0, 0).setAttribute('class', 'annulus');
    var path = document.createElementNS("http://www.w3.org/2000/svg","path");
        path.setAttribute('d', gear(80, -RADIUS * 5, true));
    $('#annulus').append(path);

    //sun
    addGroup("main", "sun", 0, 0).setAttribute('class', 'sun');
    var path = document.createElementNS("http://www.w3.org/2000/svg","path");
        path.setAttribute('d', gear(16, RADIUS, false));
    $('#sun').append(path);

    //planets
    var g = document.createElementNS("http://www.w3.org/2000/svg","g");
        g.setAttribute("id", "planets");
        g.setAttribute("transform", "rotate(0)");
    $('#main').append(g);

    addGroup("planets", "planet0", 0, -RADIUS * 3).setAttribute('class', 'planet');
    var path = document.createElementNS("http://www.w3.org/2000/svg","path");
        path.setAttribute('d', gear(32, -RADIUS * 2, false));
    $('#planet0').append(path);

    addGroup("planets", "planet1", -RADIUS * 3 * X, -RADIUS * 3 * Y).setAttribute('class', 'planet');
    var path = document.createElementNS("http://www.w3.org/2000/svg","path");
        path.setAttribute('d', gear(32, -RADIUS * 2, false));
    $('#planet1').append(path);

    addGroup("planets", "planet2", RADIUS * 3 * X, -RADIUS * 3 * Y).setAttribute('class', 'planet');
    var path = document.createElementNS("http://www.w3.org/2000/svg","path");
        path.setAttribute('d', gear(32, -RADIUS * 2, false));
    $('#planet2').append(path);
}

function gear(teeth, radius, annulus) {
  var n = teeth,
      r2 = Math.abs(radius),
      r0 = r2 - 8,
      r1 = r2 + 8,
      r3 = annulus ? (r3 = r0, r0 = r1, r1 = r3, r2 + 20) : 20,
      da = Math.PI / n,
      a0 = -Math.PI / 2 + (annulus ? Math.PI / n : 0),
      i = -1,
      path = ["M", r0 * Math.cos(a0), ",", r0 * Math.sin(a0)];
  while (++i < n) path.push(
      "A", r0, ",", r0, " 0 0,1 ", r0 * Math.cos(a0 += da), ",", r0 * Math.sin(a0),
      "L", r2 * Math.cos(a0), ",", r2 * Math.sin(a0),
      "L", r1 * Math.cos(a0 += da / 3), ",", r1 * Math.sin(a0),
      "A", r1, ",", r1, " 0 0,1 ", r1 * Math.cos(a0 += da / 3), ",", r1 * Math.sin(a0),
      "L", r2 * Math.cos(a0 += da / 3), ",", r2 * Math.sin(a0),
      "L", r0 * Math.cos(a0), ",", r0 * Math.sin(a0));
  path.push("M0,", -r3, "A", r3, ",", r3, " 0 0,0 0,", r3, "A", r3, ",", r3, " 0 0,0 0,", -r3, "Z");
  return path.join("");
}

function initialSVG(parentName, svgID){
    var svg = document.createElementNS("http://www.w3.org/2000/svg","svg");
        svg.setAttribute("id", svgID);
        svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
        svg.setAttribute("version", "1.1");
        svg.setAttribute("width", WIDTH);
        svg.setAttribute("height", HEIGHT);

        $(parentName).append(svg);

    return svgID;
}

function addGroup(parentId, groupID, translateX, translateY){
    var g = document.createElementNS("http://www.w3.org/2000/svg","g");
        g.setAttribute("id", groupID);
        g.setAttribute("transform", "translate(" + translateX + "," + translateY + ")");

        $('#' + parentId).append(g);

    return g;
}
