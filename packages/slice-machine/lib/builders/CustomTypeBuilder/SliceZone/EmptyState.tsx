import { Box, Heading, Button } from "@theme-ui/components"


const EmptyState = ({ onCreate }:  { onCreate: Function }) => {
  return (
    <Box p={2}>
      <Heading>
        Create a SliceZone
      </Heading>
      <Button onClick={() => onCreate()}>Create</Button>
    </Box>
  )
}

export default EmptyState
