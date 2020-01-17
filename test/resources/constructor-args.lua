-- should deploy with { key, value }
-- should get "value" with { key }

function constructor(key, value)
  system.setItem(key, value)
end

function get(key)
  return system.getItem(key)
end

abi.register_view(get)
