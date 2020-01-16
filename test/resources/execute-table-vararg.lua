-- should set with { key, 1, 2, 3, 4 }
-- should get with { key } returns "1234"

function set(key, ...)
  local s = ""
  for i,v in ipairs{...} do
    s = s .. v
  end
  system.setItem(key, s)
end

function get(key)
  return system.getItem(key)
end

abi.register(set)
abi.register_view(get)
