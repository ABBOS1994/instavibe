import React from 'react'
import Marquee from 'react-fast-marquee'

const ScrollingText = () => {
  return (
    <Marquee className={'marquee'} autoFill pauseOnHover direction="left">
      {['INSTAVIBE', '◦', ' SHAXSIY BREND QURISHNI BUGUNDAN BOSHLA!', '◦'].map(
        (s, i) => (
          <span key={i} className={s === 'INSTAVIBE' ? 'brand' : ''}>
            &nbsp;{s}&nbsp;
          </span>
        )
      )}
    </Marquee>
  )
}

export default ScrollingText
