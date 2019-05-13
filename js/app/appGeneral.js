function checkExist(value) {
    return !(typeof(value) == "undefined" || value == null);
}

function grausToRadianos(graus) {
    return (graus * Math.PI / 180);
}

function radianosToGraus(radianos) {
    return (radianos * 180 / Math.PI);
}
