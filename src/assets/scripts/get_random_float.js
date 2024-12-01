export default function(max, min = 0){
    return Math.random() * (max - min) + min;
}