var Utils = function () {
    var uniqueID = 0;

return {
    UniqueID: function () {
        
        return uniqueID++;
        
    }   
    ,
    RandomNum: function ( min, max ) {

        return Math.floor( Math.random() * (max - min + 1 ) + min );

    }
    ,
    RandomFromArray: function ( arr, num ){

        var chosenNumbers = [];
        var chosen = [];

        while ( chosen.length < num ) {

            var randomNum = this.RandomNum( 0, arr.length - 1 );

            if ( chosenNumbers.indexOf( randomNum ) == -1 ) {

                var obj = arr[ randomNum ];
                if( obj ) chosen.push( obj );

            }            

        }

        return chosen;

    }
    ,
    ArrayFromProp: function ( arr, prop ) {

        var newArr = [];
        var selectedFunction;

        ( prop.constructor.name == "Array" ) ?
            selectedFunction = cycleProps :
            selectedFunction = singleProp;


        for (var i = 0; i < arr.length; i++) 
            selectedFunction( arr[i], prop );

        return newArr;

        function singleProp ( obj, prop ) {

            newArr.push( obj[prop] );

        }

        function cycleProps (obj, prop) {

            var propsArr = [];

            for ( var p = 0; p < prop.length; p++ ) 
                propsArr.push( obj[ prop[p] ] );

            newArr = newArr.concat( propsArr );
        }

    }
    ,
    PointInTriangle: function( pt, tri ) {

        function sign (p1, p2, p3) {

            return (p1.x - p3.x) * (p2.y - p3.y) - (p2.x - p3.x) * (p1.y - p3.y);

        }

        var b1 = sign(pt, tri.a, tri.b) < 0;
        var b2 = sign(pt, tri.b, tri.c) < 0;
        var b3 = sign(pt, tri.c, tri.a) < 0;

        return ((b1 == b2) && (b2 == b3)); 
        
    }
    ,
    MakeQuadTrees: function ( points ) {

        var v1 = new Vector2(0, 0);
        var v2 = new Vector2(width, 0);
        var v3 = new Vector2(width, height);
        var v4 = new Vector2(0, height);
        var newQuad = new QuadTree( v1, v2, v3, v4 );

        newQuad.Start( points );

        return newQuad;
        
    }   
    ,
    LogTime: function (points, time) {

        document.getElementById("time").innerHTML = points + " points " + time + " ms";
        
    } 
}    
}();


function PointInCircumcircle ( pt, tri ) {

    var A = tri.a.x;
    var B = tri.a.y;
    var C = Math.pow( tri.a.x, 2 ) + Math.pow( tri.a.y, 2 );
    var D = 1;
    var E = tri.b.x;
    var F = tri.b.y;
    var G = Math.pow( tri.b.x, 2 ) + Math.pow( tri.b.y, 2 );
    var H = 1;
    var I = tri.c.x;
    var J = tri.c.y;
    var K = Math.pow( tri.c.x, 2 ) + Math.pow( tri.c.y, 2 );
    var L = 1;
    var M = pt.x;
    var N = pt.y;
    var O = Math.pow( pt.x, 2 ) + Math.pow( pt.y, 2 );
    var P = 1;

    var M = new Matrix4( A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P );  
    var result = Matrix.DetM4( M );  

    return ( result < 0 ) ? true : false;

}

function FindUniqueLines ( tris ) {

    var lines = [];
    var uniqueLines = [];

    for ( var t = 0; t < tris.length; t++ ) 

        lines = lines.concat( [ tris[t].lines.AB, 
                                tris[t].lines.BC, 
                                tris[t].lines.CA ]);

    for ( var l = 0; l < lines.length; l++ ) {              // line to test

        var curL = lines[l];

        var linesWithout = lines.slice( 0 );
        linesWithout.splice( l, 1 );                        // remove line to test from test array

        var matches = 0;         

        for (var ol = 0; ol < linesWithout.length; ol++ ) { // other lines
            var otherL = linesWithout[ol];

            if ( IsSameLine ( curL, otherL ) ) matches++;   // line shared by 2 tris 

        };

        if( matches == 0 ) uniqueLines.push( curL );        // unique line
    };

    return uniqueLines;

}

function IsSamePoint ( p1, p2 ) {

    if ( p1.x == p2.x && p1.y == p2.y ) return true;
    if ( p1.x == p2.y && p1.y == p2.x ) return true;

    return false;

}

function IsSameLine ( l1, l2 ) {

    if ( IsSamePoint( l1.v1, l2.v1 ) && IsSamePoint( l1.v2, l2.v2 ) ) return true;
    if ( IsSamePoint( l1.v2, l2.v1 ) && IsSamePoint( l1.v1, l2.v2 ) ) return true;

    return false;

}

function Sort ( arr, prop ) { // bubble sort

    var swapped = true;

    while (swapped) { 

        swapped = false;

        for ( var i = 1; i < arr.length; i++ ) {

            var curVal  = arr[ i ][prop];
            var lastVal = arr[ i - 1 ][prop];
            var temp = undefined;

            if ( curVal < lastVal ) {

                swapped = true;
                temp = arr[ i ];
                arr[ i ]     = arr[ i - 1 ];
                arr[ i - 1 ] = temp;

            }

        };

    }   

    return arr;

}

function FindCentroid ( tri ) {

    var x = ( tri.a.x + tri.b.x + tri.c.x ) / 3;
    var y = ( tri.a.y + tri.b.y + tri.c.y ) / 3;

    tri.centroid = new Vector2 ( x, y );

    return tri.centroid;

}

function FindPolyCentroid ( pts ) {

    var totalX = 0;
    var totalY = 0;
    var length = pts.length;

    for ( var p = 0; p < length; p++ ) {

        totalX += pts[p].x;
        totalY += pts[p].y;

    };

    return new Vector2 ( totalX / length, totalY / length );

}

function FindMidpoint ( tri ) {

    var sumVecAB = Vector.add( tri.a, tri.b ) ;
    var sumVecBC = Vector.add( tri.b, tri.c ) ;
    var sumVecCA = Vector.add( tri.c, tri.a ) ;

    
    var sumAB = new Line ( new Vector2(0, 0), sumVecAB );
    var lineAB = new Line ( tri.a, tri.b );

    var sumBC = new Line ( new Vector2(0, 0), sumVecBC );
    var lineBC = new Line ( tri.b, tri.c );

    var sumCA = new Line ( new Vector2(0, 0), sumVecCA );
    var lineCA = new Line ( tri.c, tri.a );

    tri.lines.AB.midpoint = FindIntersection(sumAB, lineAB);
    tri.lines.BC.midpoint = FindIntersection(sumBC, lineBC);
    tri.lines.CA.midpoint = FindIntersection(sumCA, lineCA);

    return [ tri.lines.AB.midpoint,
             tri.lines.BC.midpoint,
             tri.lines.CA.midpoint ];  

}

function FindIntersection ( line1, line2 ) {

    var intersectX = 
       (( line1.v1.x * line1.v2.y - line1.v1.y * line1.v2.x ) * 
        ( line2.v1.x - line2.v2.x ) -
        ( line1.v1.x - line1.v2.x ) *
        ( line2.v1.x * line2.v2.y - line2.v1.y * line2.v2.x )) /
       (( line1.v1.x - line1.v2.x ) *
        ( line2.v1.y - line2.v2.y ) -
        ( line1.v1.y - line1.v2.y ) *
        ( line2.v1.x - line2.v2.x ));

    var intersectY =  
       (( line1.v1.x * line1.v2.y - line1.v1.y * line1.v2.x ) * 
        ( line2.v1.y - line2.v2.x ) -
        ( line1.v1.y - line1.v2.y ) *
        ( line2.v1.x * line2.v2.y - line2.v1.y * line2.v2.x )) /
       (( line1.v1.x - line1.v2.x ) *
        ( line2.v1.y - line2.v2.y ) -
        ( line1.v1.y - line1.v2.y ) *
        ( line2.v1.x - line2.v2.x ));

    return new Vector2 ( intersectX, intersectY );

}

function ArrangePointsCCWTri ( tri ) {

    var pts = [ tri.a, tri.b, tri.c ];

    for ( var p = 0; p < pts.length; p++ ) 
        pts[p].angle = Math.atan2( (pts[p].y - tri.centroid.y), (pts[p].x - tri.centroid.x) );

    pts = Sort( pts, "angle" );

    tri.a = pts [2];
    tri.b = pts [1];
    tri.c = pts [0];

    return tri;
    
}

function ArrangePointsCCWPoly ( pts, centroid ) {

    centroid = centroid || FindPolyCentroid( pts );

    for ( var p = 0; p < pts.length; p++ ) 
        pts[p].angle = Math.atan2( (pts[p].y - centroid.y), (pts[p].x - centroid.x) );

    return Sort( pts, "angle" );
    
}

function CheckCCW ( p1, p2, p3 ) { // ccw > 0, cwise < 0, collinear if ccw = 0

    return (p2.x - p1.x)*(p3.y - p1.y) - (p2.y - p1.y)*(p3.x - p1.x);

}
