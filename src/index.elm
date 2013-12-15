main = image 300 500 . chooseImg <~ wobble

wobble : Signal Bool
wobble = foldp (\_ -> not) False <| every (500 * millisecond)

chooseImg c = if c then "img/forward2.png" else "img/forward1.png"

tilt : Signal Int
tilt = constant 0
