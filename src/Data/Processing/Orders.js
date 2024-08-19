export const addTotalSums = (orders) => {
    return orders.map((order) => {
        const totalSum     = order[0] * order[1]
        const updatedLevel = [...order, totalSum]
        return updatedLevel
    })
}

export const addDepths = (orders, maxTotal) => {
    return orders.map(order => {
        const depth        = (order[2] / maxTotal) * 100
        const updatedLevel = [...order, depth]
        return updatedLevel
    })
}

export const addPrecison = (orders) => {
    return orders.map((order, idx) => {
        const orderPrice    = order[0]
        const orderQty      = order[1]
        const orderTotalSum = order[2]
        return {
            id: idx, 
            level: [orderPrice, orderQty, orderTotalSum, order[3]]
        }
    })
}

export const getMaxTotalSum = (orders) => {
    const totalSum = orders.map(order => order[2])
    return Math.max(...totalSum)
}

export const sortOrders = (orders) => {
    let updatedOrders = orders.map((order) => [parseFloat(order[0]), parseFloat(order[1])])
    updatedOrders.sort((a, b) => b[0] - a[0])
    return updatedOrders
}