import Keyboard

main = foldr1 above <~ combine [ifthenelse <~ isStillGoing ~ mainGame ~ deathScreen, score]

ifthenelse : Bool -> a -> a -> a
ifthenelse b x y = if b then x else y

mainGame = display

death : Float -> Element
death o = collage 1000 500 [moveX o <| toForm <| image 400 400 "img/crash.png"]

deathScreen : Signal Element
deathScreen = death <~ offset

offset : Signal Float
offset = (*) 50 <~ keepWhen isStillGoing 0 drift

wobble : Signal Bool
wobble = foldp (\_ -> not) False <| every (500 * millisecond)

chooseImg c = if c then "img/forward2.png" else "img/forward1.png"

display : Signal Element
display = collage 900 500 . (\x->[x]) <~ lift2 moveX offset (rotate <~ rotationAngle ~ (toForm . image 300 500 . chooseImg <~ wobble))

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

tiltSafe : Signal Bool
tiltSafe = (\x -> x > -1 && x < 1) <~ tilt

driftSafe : Signal Bool
driftSafe = (\x -> x > -10 && x < 10) <~ drift

isStillGoing : Signal Bool
isStillGoing = dropWhen ((&&) <~ tiltSafe ~ driftSafe) True (constant False)

scoreNo = (*) 25 <~ count (keepWhen isStillGoing 0 (every (second/4)))

score = centered . toText . (++) "Score: " . show <~ scoreNo
