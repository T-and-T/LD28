main = foldr1 above <~ combine [display, tiltInfo, driftInfo]

wobble : Signal Bool
wobble = foldp (\_ -> not) False <| every (500 * millisecond)

chooseImg c = if c then "img/forward2.png" else "img/forward1.png"

display : Signal Element
display = image 300 500 . chooseImg <~ wobble

tiltInfo : Signal Element
tiltInfo = centered . toText . (++) "Tilt (keep between -1 and 1): " . show <~ tilt

driftInfo : Signal Element
driftInfo = centered . toText . (++) "Drift (keep between -10 and 10): " . show <~ drift

tilt : Signal Float
tilt = constant 0

drift : Signal Float
drift = foldp (+) 0 tilt
