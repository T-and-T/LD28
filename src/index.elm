import Keyboard

main = foldr1 above <~ combine [display, tiltInfo, driftInfo]

wobble : Signal Bool
wobble = foldp (\_ -> not) False <| every (500 * millisecond)

chooseImg c = if c then "img/forward2.png" else "img/forward1.png"

display : Signal Element
display = collage 900 500 . (\x->[x]) <~ (rotate <~ rotationAngle ~ (toForm . image 300 500 . chooseImg <~ wobble))

tiltInfo : Signal Element
tiltInfo = centered . toText . (++) "Tilt (keep between -1 and 1): " . show <~ tilt

driftInfo : Signal Element
driftInfo = centered . toText . (++) "Drift (keep between -10 and 10): " . show <~ drift

pedalStep : Bool -> Float
pedalStep b = if b then -0.2 else 0.2

leaning : Signal Float
leaning = (*) 0.25 . toFloat . .x <~ sampleOn (every (50 * millisecond)) Keyboard.arrows

tilt : Signal Float
tilt = lift ((*) 0.1) <| foldp (+) 0 <| (+) . pedalStep <~ wobble ~ leaning

rotationAngle : Signal Float
rotationAngle = asin . flip (/) (0-sqrt 2) <~ tilt

drift : Signal Float
drift = foldp (+) 0 tilt
