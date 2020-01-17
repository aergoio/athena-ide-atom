-- should set with { key, value }
-- should get "value" with { key }

function set(key, value)
  system.setItem(key, value)
end

function get(key)
  return system.getItem(key)
end

abi.register(set)
abi.register_view(get)
