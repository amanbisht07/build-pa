
import React from 'react';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';

const useStyles = makeStyles((theme) => ({
  root: {
    width: 500,
    '& > * + *': {
      marginTop: theme.spacing(3),
    },
  },
}));

export default function MultipleSelect() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      
      <Autocomplete
        multiple
        id="tags-outlined"
        options={rolesSelect}
        getOptionLabel={(option) => option.title}
        defaultValue={[rolesSelect[1]]}
        filterSelectedOptions
        renderInput={(params) => (
          <TextField
            {...params}
            variant="outlined"
            label="SELECT ROLES"
            placeholder="Select Roles"
          />
        )}
      />
      
    </div>
  );
}

const rolesSelect = [
  { title: 'HRC' },
  { title: 'HRC.HRC'},
  { title: 'HRC.hrc1' },
  { title: 'hrc1.hrc1' },
  { title: 'HRC1.hrc' },
];
