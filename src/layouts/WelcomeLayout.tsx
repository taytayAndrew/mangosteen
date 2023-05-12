

import { animated, useTransition } from '@react-spring/web'
import { ReactNode, useMemo } from 'react'
import { useEffect, useRef, useState } from 'react'
import { Link, useLocation, useNavigate, useOutlet } from 'react-router-dom'
import logo from '../assets/images/logo.svg'
import { useSwipe } from '../hooks/useSwipe'
import { useLocalStore } from '../stores/useLocalStore'
const nextLinkMap: Record<string, string> = {
  '/welcome/1': '/welcome/2',
  '/welcome/2': '/welcome/3',
  '/welcome/3': '/welcome/4',
  '/welcome/4': '/welcome/xxx',
}
const prevLinkMap: Record<string, string> = {
  '/welcome/2': '/welcome/1',
  '/welcome/3': '/welcome/2',
  '/welcome/4': '/welcome/3'
}
export const WelcomeLayout: React.FC = () => {
  const animating = useRef(false)
  const map = useRef<Record<string, ReactNode>>({})
  const location = useLocation()
  const outlet = useOutlet()
  const main = useRef<HTMLElement>(null)
  const { direction } = useSwipe(main)
  map.current[location.pathname] = outlet
  const transitionRef = useRef({})
  const translateX = direction === 'right' ? -100 : 100
  const first = location.pathname === '/welcome/1' && direction === ''
  const [extraStyle, setExtraStyle] = useState<{ position: 'relative' | 'absolute' }>({ position: 'relative' })
  const transitions = useTransition(location.pathname, {
    from: { transform: `translateX(${first ? 0 : translateX}%)` },
    enter: { transform: 'translateX(0%)' },
    leave: { transform: `translateX(${-translateX}%)`, },
    config: { duration: 350 },
    onStart: () => setExtraStyle({ position: 'absolute' }),
    onRest: () => {
        animating.current = false
        setExtraStyle({ position: 'relative' })
    }

  })
  const nav = useNavigate()
  useEffect(() => {
    if (direction === 'left') {
      if (animating.current) { return }
      animating.current = true
      nav(nextLinkMap[location.pathname])
    }
    if(direction === 'right'){
      if (animating.current) { return }
      animating.current = true
      nav(prevLinkMap[location.pathname])
    }
  }, [direction])
  const { setHasReadWelcomes } = useLocalStore()
  const onSkip = () => {
    setHasReadWelcomes(true)
  }
  return (
    <div className="bg-#33cbda" h-screen flex flex-col items-stretch pb-16px>
      <Link fixed text-white top-16px right-16px text-32px to="/welcome/xxx" >跳过</Link>
      <header shrink-0 text-center pt-64px>
        <img src={logo} w-64px h-69px />
        <h1 text="#D4D4EE" text-32px>山竹记账</h1>
      </header>
      <main shrink-1 grow-1 relative ref={main} >
        {transitions((style, pathname) =>
          <animated.div key={pathname} style={{ ...style, ...extraStyle }} w="100%" h="100%" p-16px flex>
            <div grow-1 bg-white flex justify-center items-center rounded-8px>
              {map.current[pathname]}
            </div>
          </animated.div>
        )}
      </main>
    
    </div>
  )
}
