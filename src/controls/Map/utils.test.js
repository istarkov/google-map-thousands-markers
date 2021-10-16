const utils = require("./utils")
// @ponicode
describe("utils.vecAdd", () => {
    test("0", () => {
        let callFunction = () => {
            utils.vecAdd({ x: -10, y: 320 }, { x: 10, y: "bar" })
        }
    
        expect(callFunction).not.toThrow()
    })

    test("1", () => {
        let callFunction = () => {
            utils.vecAdd({ x: 70, y: 350 }, { x: 0, y: "bar" })
        }
    
        expect(callFunction).not.toThrow()
    })

    test("2", () => {
        let callFunction = () => {
            utils.vecAdd({ x: "bar", y: 1 }, { x: 400, y: 410 })
        }
    
        expect(callFunction).not.toThrow()
    })

    test("3", () => {
        let callFunction = () => {
            utils.vecAdd({ x: 0, y: 320 }, { x: 1, y: 1 })
        }
    
        expect(callFunction).not.toThrow()
    })

    test("4", () => {
        let callFunction = () => {
            utils.vecAdd({ x: 0, y: 410 }, { x: 10, y: 350 })
        }
    
        expect(callFunction).not.toThrow()
    })

    test("5", () => {
        let callFunction = () => {
            utils.vecAdd(undefined, { x: -Infinity, y: -Infinity })
        }
    
        expect(callFunction).not.toThrow()
    })
})

// @ponicode
describe("utils.vecMul", () => {
    test("0", () => {
        let callFunction = () => {
            utils.vecMul({ x: 0, y: 1 }, 0.0)
        }
    
        expect(callFunction).not.toThrow()
    })

    test("1", () => {
        let callFunction = () => {
            utils.vecMul({ x: 100, y: -10 }, 0.0)
        }
    
        expect(callFunction).not.toThrow()
    })

    test("2", () => {
        let callFunction = () => {
            utils.vecMul({ x: 10, y: -10 }, 0)
        }
    
        expect(callFunction).not.toThrow()
    })

    test("3", () => {
        let callFunction = () => {
            utils.vecMul({ x: 410, y: -10 }, 0)
        }
    
        expect(callFunction).not.toThrow()
    })

    test("4", () => {
        let callFunction = () => {
            utils.vecMul({ x: 350, y: 1 }, -10)
        }
    
        expect(callFunction).not.toThrow()
    })

    test("5", () => {
        let callFunction = () => {
            utils.vecMul(undefined, undefined)
        }
    
        expect(callFunction).not.toThrow()
    })
})

// @ponicode
describe("utils.latLng2World", () => {
    test("0", () => {
        let callFunction = () => {
            utils.latLng2World({ lat: 320, lng: 0 })
        }
    
        expect(callFunction).not.toThrow()
    })

    test("1", () => {
        let callFunction = () => {
            utils.latLng2World({ lat: 70, lng: 70 })
        }
    
        expect(callFunction).not.toThrow()
    })

    test("2", () => {
        let callFunction = () => {
            utils.latLng2World({ lat: 1, lng: 0.0 })
        }
    
        expect(callFunction).not.toThrow()
    })

    test("3", () => {
        let callFunction = () => {
            utils.latLng2World({ lat: 50, lng: 4 })
        }
    
        expect(callFunction).not.toThrow()
    })

    test("4", () => {
        let callFunction = () => {
            utils.latLng2World({ lat: 100, lng: 70 })
        }
    
        expect(callFunction).not.toThrow()
    })

    test("5", () => {
        let callFunction = () => {
            utils.latLng2World({ lat: Infinity, lng: Infinity })
        }
    
        expect(callFunction).not.toThrow()
    })
})

// @ponicode
describe("utils.tile2LatLng", () => {
    test("0", () => {
        let callFunction = () => {
            utils.tile2LatLng({ x: 50, y: 100 }, 10.0)
        }
    
        expect(callFunction).not.toThrow()
    })

    test("1", () => {
        let callFunction = () => {
            utils.tile2LatLng({ x: 350, y: 400 }, 0.5)
        }
    
        expect(callFunction).not.toThrow()
    })

    test("2", () => {
        let callFunction = () => {
            utils.tile2LatLng({ x: 1, y: 520 }, 1.0)
        }
    
        expect(callFunction).not.toThrow()
    })

    test("3", () => {
        let callFunction = () => {
            utils.tile2LatLng({ x: 4, y: 1 }, 0.5)
        }
    
        expect(callFunction).not.toThrow()
    })

    test("4", () => {
        let callFunction = () => {
            utils.tile2LatLng({ x: 30, y: 0.0 }, 2.0)
        }
    
        expect(callFunction).not.toThrow()
    })

    test("5", () => {
        let callFunction = () => {
            utils.tile2LatLng({ x: undefined, y: NaN }, NaN)
        }
    
        expect(callFunction).not.toThrow()
    })
})

// @ponicode
describe("utils.getTilesIds", () => {
    test("0", () => {
        let callFunction = () => {
            utils.getTilesIds({ bounds: [true, false, false], zoom: 0.1, tileExpand: false })
        }
    
        expect(callFunction).not.toThrow()
    })

    test("1", () => {
        let callFunction = () => {
            utils.getTilesIds({ bounds: [true, true, false], zoom: 0.5, tileExpand: true })
        }
    
        expect(callFunction).not.toThrow()
    })

    test("2", () => {
        let callFunction = () => {
            utils.getTilesIds({ bounds: [false, false, true], zoom: 10.0, tileExpand: false })
        }
    
        expect(callFunction).not.toThrow()
    })

    test("3", () => {
        let callFunction = () => {
            utils.getTilesIds({ bounds: [true, true, true], zoom: 0.5, tileExpand: true })
        }
    
        expect(callFunction).not.toThrow()
    })

    test("4", () => {
        let callFunction = () => {
            utils.getTilesIds({ bounds: [true, false, true], zoom: 1.0, tileExpand: false })
        }
    
        expect(callFunction).not.toThrow()
    })

    test("5", () => {
        let callFunction = () => {
            utils.getTilesIds({ bounds: [], zoom: -Infinity, tileExpand: true })
        }
    
        expect(callFunction).not.toThrow()
    })
})

// @ponicode
describe("utils.bboxIntersects", () => {
    test("0", () => {
        let callFunction = () => {
            utils.bboxIntersects(520, ["foo bar", -0.353, "**text**", 4653])
        }
    
        expect(callFunction).not.toThrow()
    })

    test("1", () => {
        let callFunction = () => {
            utils.bboxIntersects(320, [-1, 0.5, 1, 2, 3, 4, 5])
        }
    
        expect(callFunction).not.toThrow()
    })

    test("2", () => {
        let callFunction = () => {
            utils.bboxIntersects(350, [10, -45.9, 103.5, 0.955674])
        }
    
        expect(callFunction).not.toThrow()
    })

    test("3", () => {
        let callFunction = () => {
            utils.bboxIntersects(4, ["foo bar", -0.353, "**text**", 4653])
        }
    
        expect(callFunction).not.toThrow()
    })

    test("4", () => {
        let callFunction = () => {
            utils.bboxIntersects(400, [-1, 0.5, 1, 2, 3, 4, 5])
        }
    
        expect(callFunction).not.toThrow()
    })

    test("5", () => {
        let callFunction = () => {
            utils.bboxIntersects(undefined, undefined)
        }
    
        expect(callFunction).not.toThrow()
    })
})

// @ponicode
describe("utils.distance", () => {
    test("0", () => {
        let callFunction = () => {
            utils.distance({ x: 0, y: 520 }, { x: 400, y: 550 })
        }
    
        expect(callFunction).not.toThrow()
    })

    test("1", () => {
        let callFunction = () => {
            utils.distance({ x: 520, y: -10 }, { x: -10, y: 0 })
        }
    
        expect(callFunction).not.toThrow()
    })

    test("2", () => {
        let callFunction = () => {
            utils.distance({ x: -1, y: 90 }, { x: 90, y: 10 })
        }
    
        expect(callFunction).not.toThrow()
    })

    test("3", () => {
        let callFunction = () => {
            utils.distance({ x: -1, y: 0 }, { x: 0.0, y: 100 })
        }
    
        expect(callFunction).not.toThrow()
    })

    test("4", () => {
        let callFunction = () => {
            utils.distance({ x: 410, y: 0.0 }, { x: 90, y: -1 })
        }
    
        expect(callFunction).not.toThrow()
    })

    test("5", () => {
        let callFunction = () => {
            utils.distance({ x: undefined, y: undefined }, { x: undefined, y: undefined })
        }
    
        expect(callFunction).not.toThrow()
    })
})
