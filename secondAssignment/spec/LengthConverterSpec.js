describe("Hello World Test",function() 
{
    it("says hello", function() {
        console.log("yeah");
        expect(getTable()).toBeDefined();
    });

});



// describe("LengthConverter", function(){
//     var lengthConverter;
//     beforeEach(function(){
//         lengthConverter= new LengthConverter();
//     });
//     it("converts calculates correct values for positive number input",function(){
//         var distance= lengthConverter.convert(200,"Centimeter");
//         expect(distance['Kilometer']).toBe(0.002);
//         expect(distance['Meter']).toBe(2);
//         expect(distance['Centimeter']).toBe(200);
//         expect(distance['Millimeter']).toBe(2000);
//         expect(distance['Mile']).toBe(0.00124274);
//         expect(distance['Yard']).toBe(2.1872199999999995);
//         expect(distance['Foot']).toBe(6.56168);
//         expect(distance['Inch']).toBe(78.7402);
//         expect(distance['Nautical mile']).toBe(0.001079914);
//     });
//     it("converts calculates correct values for negative number input",function(){
//         var distance= lengthConverter.convert(-5,"Mile");
//         expect(distance['Kilometer']).toBe(-8.046722489462816);
//         expect(distance['Meter']).toBe(-8046.722489462817);
//         expect(distance['Centimeter']).toBe(-804672.2489462817);
//         expect(distance['Millimeter']).toBe(-8046722.489462817);
//         expect(distance['Mile']).toBe(-5);
//         expect(distance['Yard']).toBe(-8799.97618170143);
//         expect(distance['Foot']).toBe(-26400.00901232919);
//         expect(distance['Inch']).toBe(-316800.2690824);
//         expect(distance['Nautical mile']).toBe(-4.344884135242875);

//     });
//     it("convert returns zero values for zero number", function(){
//         var distance=lengthConverter.convert(0,"Foot");
//         expect(distance['Kilometer']).toBe(0);
//         expect(distance['Meter']).toBe(0);
//         expect(distance['Centimeter']).toBe(0);
//         expect(distance['Millimeter']).toBe(0);
//         expect(distance['Mile']).toBe(0);
//         expect(distance['Yard']).toBe(0);
//         expect(distance['Foot']).toBe(0);
//         expect(distance['Inch']).toBe(0);
//         expect(distance['Nautical mile']).toBe(0);
//     });
//     it("convert returns no values for invalid  number", function(){
//         var distance=lengthConverter.convert("garb@#$@#!^age","Foot");
//         expect(distance['Kilometer']).not.toBeDefined();
//         expect(distance['Meter']).not.toBeDefined();
//         expect(distance['Centimeter']).not.toBeDefined();
//         expect(distance['Millimeter']).not.toBeDefined();
//         expect(distance['Mile']).not.toBeDefined();
//         expect(distance['Yard']).not.toBeDefined();
//         expect(distance['Foot']).not.toBeDefined();
//         expect(distance['Inch']).not.toBeDefined();
//         expect(distance['Nautical mile']).not.toBeDefined();
//     });
//     it("convert returns no values for invalid  unit", function(){
//         var distance=lengthConverter.convert(5,"Blah");
//         expect(distance['Kilometer']).not.toBeDefined();
//         expect(distance['Meter']).not.toBeDefined();
//         expect(distance['Centimeter']).not.toBeDefined();
//         expect(distance['Millimeter']).not.toBeDefined();
//         expect(distance['Mile']).not.toBeDefined();
//         expect(distance['Yard']).not.toBeDefined();
//         expect(distance['Foot']).not.toBeDefined();
//         expect(distance['Inch']).not.toBeDefined();
//         expect(distance['Nautical mile']).not.toBeDefined();
//     });

// });