-- should set with { key, 1, 2, 3 }
-- should get "123" with { key }

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
