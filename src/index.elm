main = image 300 500 . chooseImg <~ foldp (\_ -> not) False (every (500 * millisecond))

chooseImg c = if c then "forward2.png" else "forward1.png"

pitch : Signal Int
pitch = constant 0

roll : Signal Int
roll = constant 0

yaw : Signal Int
yaw = constant 0
