import { Blockquote, Em } from "@chakra-ui/react"

interface WelcomeMessageProps {
  loginStreak: number
}

export const WelcomeMessage = ({ loginStreak }: WelcomeMessageProps) => {
  let message = ""
  if (loginStreak > 0 && loginStreak < 4) {
    message = "Every streak starts at 0...one day at a time!"
  } else if (loginStreak >= 4 && loginStreak < 7) {
    message = "Killing it! You've been showing up for yourself for almost a week now!"
  } else if (loginStreak >= 7 && loginStreak < 14) {
    message = "Amazing streak! You're on fire and building real momentum!"
  } else if (loginStreak >= 14 && loginStreak < 21) {
    message = "They say it takes 21 days to build a habit...Don't quit now!"
  } else if (loginStreak >= 21 && loginStreak < 30) {
    message = "🏆 You’re unstoppable! Just a few days away from hitting 30!"
  } else if (loginStreak >= 30) {
    message = "🌟 30-day legend! You've built a rock-solid habit. Keep the streak alive!"
  }
  return (
    <Blockquote.Root>
      <Blockquote.Content>
        <Em>{message}</Em>
      </Blockquote.Content>
    </Blockquote.Root>
  )
}
