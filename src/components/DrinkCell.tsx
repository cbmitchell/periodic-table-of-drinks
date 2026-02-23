import { Box, Card, CardContent, Grid, List, ListItem, ListItemText, Typography } from "@mui/material";

export type GlassIconName =
	| "collins"
	| "coup"
	| "flute"
	| "hurricane"
	| "irish"
	| "margarita"
	| "martini"
	| "mule"
	| "pint"
	| "rocks"
	| "tiki"
	| "wine";

const glassIcons: Record<GlassIconName, string> = {
	collins: "",
	coup: "",
	flute: "",
	hurricane: "glass-icons/black/hurricane.png",
	irish: "",
	margarita: "",
	martini: "",
	mule: "",
	pint: "",
	rocks: "",
	tiki: "",
	wine: "",
};

const debugColors = true

interface DrinkCellProps {
	title: string;
	abbreviation: string;
	icon: GlassIconName;
	ingredients: string[];
	instructions?: string[];
}

export function DrinkCell({
	title,
	abbreviation,
	icon,
	ingredients,
	instructions = [""],
}: DrinkCellProps) {
	return (
		<Card sx={{ width: 256, height: 320, backgroundColor: 'lightblue' }}>
			<CardContent>
        <Grid container spacing={0}>
          <Grid size={8}>
            <Box>
              <Typography sx={{ 
                // backgroundColor: "lightGrey",
                fontWeight: "medium",
                minHeight: 48,
                lineHeight: 1.2,
              }}>
                {title}
              </Typography>
              <Typography sx={{
                fontSize: 80,
                fontWeight: 'bold',
                lineHeight: 0.8,
                // backgroundColor: "lightGreen",
                height: 64,

              }}>
                {abbreviation}
              </Typography>
            </Box>
          </Grid>
          <Grid size={4} sx={{ position: 'relative' }}>
            <Box
              component='img'
              src={glassIcons[icon]}
              sx={{
                // backgroundColor: 'pink',
                width: '100%',
                position: 'absolute',
                bottom: 0,
              }}>
            </Box>
          </Grid>
          <Grid size={6}>
            <Box sx={{p: 1}}>
              <List
                dense 
                sx={{ 
                  listStyleType: 'disc', 
                  pl: 0,
                }}
              >
                {ingredients.map((ingredient) => (
                  <ListItem key={ingredient} disablePadding>
                    <ListItemText
                      sx={{
                        fontSize: 8,
                        display: 'list-item',
                        my: 0,
                      }}
                      primary={ingredient}
                      slotProps={{
                        primary: {
                          sx: {
                            // backgroundColor: 'lightgrey',
                            fontSize: '8pt',
                          }
                        }
                      }}
                    />
                  </ListItem>
                ))}
              </List>
            </Box>
          </Grid>
          <Grid size={6}>
            <Box sx={{p: 1}}>
              <List
                dense 
                sx={{ 
                  listStyleType: 'disc', 
                  pl: 0,
                }}
              >
                {instructions.map((instruction) => (
                  <ListItem key={instruction} disablePadding>
                    <ListItemText
                      sx={{
                        fontSize: 8,
                        display: 'list-item',
                        my: 0,
                      }}
                      primary={instruction}
                      slotProps={{
                        primary: {
                          sx: {
                            // backgroundColor: 'lightgrey',
                            fontSize: '8pt',
                          }
                        }
                      }}
                    />
                  </ListItem>
                ))}
              </List>
            </Box>
          </Grid>
        </Grid>
			</CardContent>
		</Card>
	);
}
