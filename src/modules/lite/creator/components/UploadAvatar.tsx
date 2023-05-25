import React, { useState } from "react"
import { Avatar, Grid, styled, Typography } from "@material-ui/core"
import { SmallButton } from "modules/common/SmallButton"

const AvatarCardContainer = styled(Grid)(({ theme }) => ({
  height: "100%",
  background: theme.palette.primary.dark,
  borderRadius: 8
}))

const StyledAvatar = styled(Avatar)({
  width: 126,
  height: 126
})

const AvatarContainer = styled(Grid)(({ theme }) => ({
  marginTop: 70,
  marginBottom: 30,
  [theme.breakpoints.down("sm")]: {
    marginTop: 30
  }
}))

const AvatarBox = styled(Grid)(({ theme }) => ({
  borderBottom: `0.3px solid ${theme.palette.primary.light}`,
  paddingLeft: 26,
  height: 54,
  display: "grid",
  alignItems: "center"
}))

export const UploadAvatar: React.FC<any> = ({ setFieldValue, values, disabled }) => {
  const [avatarPreview, setAvatarPreview] = useState<any>("")
  const hiddenFileInput = React.useRef<HTMLInputElement>(null)

  const handleClick = () => {
    if (hiddenFileInput) {
      hiddenFileInput.current?.click()
    }
  }

  return (
    <AvatarCardContainer container direction={"column"}>
      <AvatarBox item>
        <Typography color="textSecondary">Avatar</Typography>
      </AvatarBox>
      <AvatarContainer container item style={{ gap: 28 }} alignItems={"center"} direction={"column"}>
        <Grid item>
          <StyledAvatar src={avatarPreview} />
        </Grid>

        <Grid item>
          <SmallButton variant="contained" color="secondary" onClick={handleClick}>
            Upload
            <input
              ref={hiddenFileInput}
              name="picUri"
              accept="image/*"
              type="file"
              style={{ display: "none" }}
              onChange={e => {
                const fileReader = new FileReader()
                fileReader.onload = () => {
                  if (fileReader.readyState === 2) {
                    setFieldValue("picUri", fileReader.result)
                    setAvatarPreview(fileReader.result)
                  }
                }
                if (e.target && e.target.files && e.target.files?.length > 0) {
                  fileReader.readAsDataURL(e.target.files[0])
                }
              }}
            />
          </SmallButton>
        </Grid>
      </AvatarContainer>
    </AvatarCardContainer>
  )
}
