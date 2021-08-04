const mapDBToModel = ({
  id,
  created_at,
  updated_at,
  title,
  year,
  performer,
  genre,
  duration,
}) => ({
  id,
  insertedAt: created_at,
  updatedAt: updated_at,
  title,
  year: parseInt(year),
  performer,
  genre,
  duration: parseInt(duration),
});

module.exports = {mapDBToModel};
